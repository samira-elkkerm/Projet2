import React, { useState, useEffect } from 'react';
import SidebarMenu from '../../layout/MenuAdmin';
import axios from 'axios';
import {
  LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { 
  DatePicker, Select, Spin, Alert, Card, Statistic, Table, Tag, 
  Row, Col, Typography, Divider 
} from 'antd';
import {
  ShoppingCartOutlined, DollarOutlined, ShoppingOutlined, 
  PieChartOutlined, BarChartOutlined, LineChartOutlined,
  EnvironmentOutlined, CreditCardOutlined, WarningOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const TableauBord = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    productStats: null,
    trends: null
  });
  const [loading, setLoading] = useState({
    stats: true,
    products: true,
    trends: true
  });
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('weekly');
  const [dateRange, setDateRange] = useState([
    moment().subtract(1, 'months'),
    moment()
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading({ stats: true, products: true, trends: true });
        setError(null);

        const [statsRes, productsRes, trendsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/dashboard/stats'),
          axios.get('http://localhost:8000/api/dashboard/statistics'),
          axios.get(`http://localhost:8000/api/dashboard/trends/${period}`)
        ]);

        setDashboardData({
          stats: statsRes.data.data,
          productStats: productsRes.data.data,
          trends: trendsRes.data.data
        });

        setLoading({ stats: false, products: false, trends: false });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || err.message);
        setLoading({ stats: false, products: false, trends: false });
      }
    };

    fetchDashboardData();
  }, [period]);

  const handlePeriodChange = (value) => {
    setPeriod(value);
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'livre': { color: 'green', icon: null },
      'en cour': { color: 'orange', icon: null },
      'en_attente': { color: 'blue', icon: null },
      'annulée': { color: 'red', icon: null },
      'default': { color: 'gray', icon: null }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.default;
    return (
      <Tag color={config.color} style={{ textTransform: 'capitalize' }}>
        {config.icon && React.createElement(config.icon, { style: { marginRight: 4 } })}
        {status}
      </Tag>
    );
  };

  const prepareChartData = (data) => {
    if (!data) return [];
    
    return data.map(item => ({
      name: item.year 
        ? period === 'monthly' 
          ? `${item.year}-${String(item.month).padStart(2, '0')}`
          : period === 'weekly'
            ? `S${item.week} ${item.year}`
            : item.date
        : moment(item.date).format('DD/MM'),
      commandes: item.count,
      revenue: item.revenue
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarMenu />
        <div style={styles.mainContent}>
          <Alert
            message="Erreur de chargement"
            description={error}
            type="error"
            showIcon
            style={{ margin: 24 }}
          />
        </div>
      </div>
    );
  }

  const isLoading = loading.stats || loading.products || loading.trends;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarMenu />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <Title level={2} style={styles.title}>
              <LineChartOutlined /> Tableau de Bord
            </Title>
            <div style={styles.controls}>
              <Select
                value={period}
                style={{ width: 150, marginRight: 16 }}
                onChange={handlePeriodChange}
                disabled={isLoading}
              >
                <Option value="daily">
                  <Text>Journalier</Text>
                </Option>
                <Option value="weekly">
                  <Text>Hebdomadaire</Text>
                </Option>
                <Option value="monthly">
                  <Text>Mensuel</Text>
                </Option>
              </Select>
              <RangePicker
                value={dateRange}
                ranges={{
                  'Aujourd\'hui': [moment(), moment()],
                  'Cette Semaine': [moment().startOf('week'), moment().endOf('week')],
                  'Ce Mois': [moment().startOf('month'), moment().endOf('month')],
                  'Ce Trimestre': [moment().startOf('quarter'), moment().endOf('quarter')],
                }}
                onChange={handleDateChange}
                style={{ width: 250 }}
                disabled={isLoading}
              />
            </div>
          </div>

          <Divider />

          {isLoading ? (
            <div style={styles.loadingContainer}>
              <Spin size="large" tip="Chargement des données..." />
            </div>
          ) : (
            <>
              {/* Statistiques Principales */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Commandes totales"
                      value={dashboardData.stats?.total_commandes || 0}
                      prefix={<ShoppingCartOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Revenu total"
                      value={dashboardData.stats?.total_revenue || 0}
                      precision={2}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                      suffix="€"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Panier moyen"
                      value={dashboardData.stats?.moyenne_panier || 0}
                      precision={2}
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ color: '#faad14' }}
                      suffix="€"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Produits en stock"
                      value={dashboardData.productStats?.total_products || 0}
                      prefix={<PieChartOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Graphiques */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} xl={12}>
                  <Card 
                    title={
                      <>
                        <LineChartOutlined /> Évolution des commandes
                      </>
                    }
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={prepareChartData(dashboardData.trends)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => 
                            name === 'revenue' 
                              ? [`${value} €`, 'Revenu'] 
                              : [value, 'Commandes']
                          }
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="commandes" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          name="Commandes"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} xl={12}>
                  <Card 
                    title={
                      <>
                        <BarChartOutlined /> Revenu par période
                      </>
                    }
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={prepareChartData(dashboardData.trends)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} €`, 'Revenu']} />
                        <Legend />
                        <Bar 
                          dataKey="revenue" 
                          fill="#82ca9d" 
                          name="Revenu (€)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              {/* Statistiques détaillées */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={8}>
                  <Card 
                    title={
                      <>
                        <PieChartOutlined /> Statut des commandes
                      </>
                    }
                  >
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={Object.entries(dashboardData.stats?.statut_stats || {}).map(([name, value]) => ({ 
                            name, 
                            value 
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(dashboardData.stats?.statut_stats || {}).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value} (${((props.payload.percent || 0) * 100).toFixed(1)}%)`,
                            props.payload.name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card 
                    title={
                      <>
                        <EnvironmentOutlined /> Top villes
                      </>
                    }
                  >
                    <Table
                      dataSource={dashboardData.stats?.ville_stats || []}
                      pagination={false}
                      size="small"
                      loading={loading.stats}
                      columns={[
                        {
                          title: 'Ville',
                          dataIndex: 'ville',
                          key: 'ville',
                          render: (text) => <Text strong>{text}</Text>,
                        },
                        {
                          title: 'Commandes',
                          dataIndex: 'count',
                          key: 'count',
                          sorter: (a, b) => a.count - b.count,
                          defaultSortOrder: 'descend',
                          render: (text) => <Text type="secondary">{text}</Text>,
                        },
                      ]}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card 
                    title={
                      <>
                        <CreditCardOutlined /> Méthodes de paiement
                      </>
                    }
                  >
                    <Table
                      dataSource={dashboardData.stats?.paiement_stats || []}
                      pagination={false}
                      size="small"
                      loading={loading.stats}
                      columns={[
                        {
                          title: 'Méthode',
                          dataIndex: 'methode_paiement',
                          key: 'methode_paiement',
                          render: (text) => <Text strong>{text}</Text>,
                        },
                        {
                          title: 'Nombre',
                          dataIndex: 'count',
                          key: 'count',
                          sorter: (a, b) => a.count - b.count,
                          defaultSortOrder: 'descend',
                          render: (text) => <Text type="secondary">{text}</Text>,
                        },
                      ]}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Tableaux détaillés */}
              <Row gutter={[16, 16]}>
                <Col xs={24} xl={12}>
                  <Card 
                    title={
                      <>
                        <ShoppingCartOutlined /> Top commandes
                      </>
                    }
                  >
                    <Table
                      dataSource={dashboardData.stats?.top_commandes || []}
                      rowKey="numero_commande"
                      loading={loading.stats}
                      columns={[
                        {
                          title: 'N° Commande',
                          dataIndex: 'numero_commande',
                          key: 'numero_commande',
                          render: (text) => <Text strong>{text}</Text>,
                        },
                        {
                          title: 'Montant',
                          dataIndex: 'total',
                          key: 'total',
                          render: (value) => <Text type="success">{`${value} €`}</Text>,
                          sorter: (a, b) => a.total - b.total,
                          defaultSortOrder: 'descend',
                        },
                        {
                          title: 'Statut',
                          dataIndex: 'statut',
                          key: 'statut',
                          render: (status) => getStatusTag(status),
                        },
                        {
                          title: 'Date',
                          dataIndex: 'created_at',
                          key: 'created_at',
                          render: (date) => (
                            <Text type="secondary">
                              {moment(date).format('DD/MM/YYYY HH:mm')}
                            </Text>
                          ),
                        },
                      ]}
                    />
                  </Card>
                </Col>
                <Col xs={24} xl={12}>
                  <Card 
                    title={
                      <>
                        <WarningOutlined /> Produits en faible stock
                      </>
                    }
                  >
                    <Table
                      dataSource={dashboardData.productStats?.low_stock_products || []}
                      rowKey="id"
                      loading={loading.products}
                      columns={[
                        {
                          title: 'Produit',
                          dataIndex: 'nom',
                          key: 'nom',
                          render: (text) => <Text strong>{text}</Text>,
                        },
                        {
                          title: 'Quantité',
                          dataIndex: 'quantité',
                          key: 'quantité',
                          render: (value) => (
                            <Tag color={value < 3 ? 'error' : 'warning'}>{value}</Tag>
                          ),
                        },
                        {
                          title: 'Prix',
                          dataIndex: 'prix',
                          key: 'prix',
                          render: (value) => <Text type="secondary">{`${value} €`}</Text>,
                        },
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {

  
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  title: {
    margin: 0,
    color: '#0B1E0F',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
  mainContent: {
    width: '80%',
    marginLeft: '25%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  contentWrapper: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f8f9fa'
  },
  searchContainer: {
    position: 'relative',
    width: '60%',
    marginRight: '15px'
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '10px',
    color: '#6c757d'
  },
  searchInput: {
    paddingLeft: '35px',
    borderRadius: '20px'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  },
  title: {
    color: '#0B1E0F',
    marginBottom: '25px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '600'
  },
  table: {
    margin: '0 auto',
    width: '100%'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #dee2e6',
    borderBottom: '1px solid #dee2e6'
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  thCell: {
    padding: '16px 12px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#495057',
    border: 'none'
  },
  tdCell: {
    padding: '14px 12px',
    textAlign: 'center',
    verticalAlign: 'middle',
    border: 'none'
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '0',
    borderRadius: '50%'
  }

};

export default TableauBord;