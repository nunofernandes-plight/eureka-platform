import mongoose from 'mongoose';

export const DashboardSchema = mongoose.Schema({
  totalArticleVersions: {
    type: String
  }
});

const Dashboard = mongoose.model('Dashboard', DashboardSchema, 'dashboard');
export default Dashboard;
