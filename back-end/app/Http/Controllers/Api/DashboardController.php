<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produite;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getCommandeStatistics()
    {
        try {
            // Statistiques générales (en groupant par numéro de commande)
            $totalCommandes = Commande::select('numero_commande')->distinct()->count('numero_commande');
            
            // Pour le revenue total, on prend la somme des totaux groupés par commande
            $totalRevenue = Commande::select('numero_commande', DB::raw('MAX(total) as commande_total'))
                ->groupBy('numero_commande')
                ->get()
                ->sum('commande_total');
                
            $moyennePanier = $totalCommandes > 0 ? $totalRevenue / $totalCommandes : 0;

            // Statistiques par statut (en comptant les commandes uniques)
            $statutStats = Commande::select('statut', DB::raw('COUNT(DISTINCT numero_commande) as count'))
                ->groupBy('statut')
                ->get()
                ->pluck('count', 'statut');

            // Commandes par ville (en comptant les commandes uniques)
            $villeStats = Commande::select('ville', DB::raw('COUNT(DISTINCT numero_commande) as count'))
                ->groupBy('ville')
                ->orderByDesc('count')
                ->limit(5)
                ->get();

            // Evolution des commandes (7 derniers jours) - commandes uniques par jour
            $recentStats = Commande::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(DISTINCT numero_commande) as count'),
                    DB::raw('SUM(DISTINCT total) as revenue')
                )
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Méthodes de paiement (par commande unique)
            $paiementStats = Commande::select('methode_paiement', DB::raw('COUNT(DISTINCT numero_commande) as count'))
                ->groupBy('methode_paiement')
                ->get();

            // Top 5 commandes les plus élevées (en groupant par numéro de commande)
            $topCommandes = Commande::select('numero_commande', 'total', 'statut', 'created_at')
                ->groupBy('numero_commande', 'total', 'statut', 'created_at')
                ->orderByDesc('total')
                ->limit(5)
                ->get();

            return response()->json([
                'status' => 200,
                'data' => [
                    'total_commandes' => $totalCommandes,
                    'total_revenue' => $totalRevenue,
                    'moyenne_panier' => round($moyennePanier, 2),
                    'statut_stats' => $statutStats,
                    'ville_stats' => $villeStats,
                    'recent_stats' => $recentStats,
                    'paiement_stats' => $paiementStats,
                    'top_commandes' => $topCommandes,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Statistiques supplémentaires pour les commandes par période (groupées par numéro de commande)
    public function getCommandeTrends($period = 'monthly')
    {
        try {
            $query = Commande::query();

            switch ($period) {
                case 'daily':
                    $query->select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('COUNT(DISTINCT numero_commande) as count'),
                        DB::raw('SUM(DISTINCT total) as revenue')
                    )
                    ->groupBy('date')
                    ->orderBy('date');
                    break;

                case 'weekly':
                    $query->select(
                        DB::raw('YEAR(created_at) as year'),
                        DB::raw('WEEK(created_at) as week'),
                        DB::raw('COUNT(DISTINCT numero_commande) as count'),
                        DB::raw('SUM(DISTINCT total) as revenue')
                    )
                    ->groupBy('year', 'week')
                    ->orderBy('year')
                    ->orderBy('week');
                    break;

                case 'monthly':
                default:
                    $query->select(
                        DB::raw('YEAR(created_at) as year'),
                        DB::raw('MONTH(created_at) as month'),
                        DB::raw('COUNT(DISTINCT numero_commande) as count'),
                        DB::raw('SUM(DISTINCT total) as revenue')
                    )
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month');
                    break;
            }

            $trends = $query->get();

            return response()->json([
                'status' => 200,
                'period' => $period,
                'data' => $trends
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Erreur lors de la récupération des tendances',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getProductStatistics()
    {
        try {
            $totalProducts = Produite::count();
            $totalQuantity = Produite::sum('quantité');
            
            // Statistics by category
            $categoryStats = Produite::select(
                'id_categorie',
                DB::raw('COUNT(*) as product_count'),
                DB::raw('SUM(quantité) as total_quantity')
            )
            ->groupBy('id_categorie')
            ->get();

            // Price statistics
            $priceStats = [
                'average_price' => Produite::avg('prix'),
                'min_price' => Produite::min('prix'),
                'max_price' => Produite::max('prix')
            ];

            // Low stock products (less than 5 in quantity)
            $lowStockProducts = Produite::where('quantité', '<', 5)
                ->orderBy('quantité')
                ->get();

            return response()->json([
                'status' => 200,
                'data' => [
                    'total_products' => $totalProducts,
                    'total_quantity' => $totalQuantity,
                    'category_stats' => $categoryStats,
                    'price_stats' => $priceStats,
                    'low_stock_products' => $lowStockProducts
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error retrieving product statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}