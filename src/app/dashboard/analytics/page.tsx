import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import { Header } from '@/components/header/header';
import { PageTitle } from '@/components/ui/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ScatterChart } from 'recharts';
import { RootState } from '@/services/store';
import { useAppDispatch } from '@/services/store';
import { fetchUserNutrition } from '@/services/nutritionSlice';

const AnalyticsPage = () => {
  const dispatch = useAppDispatch();
  const [timeRange, setTimeRange] = useState('month');
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, loading, dailyStats, weeklyData, monthlyData } = useSelector((state: RootState) => state.nutrition);

  // Derived data for charts
  const nutritionHistory = weeklyData.length > 0 ? weeklyData : [
    { date: 'Apr 1', calories: 1800, carbs: 220, protein: 75, fat: 60, sugar: 40, fiber: 15 },
    { date: 'Apr 5', calories: 1950, carbs: 235, protein: 82, fat: 65, sugar: 42, fiber: 18 },
    { date: 'Apr 10', calories: 2100, carbs: 250, protein: 90, fat: 70, sugar: 45, fiber: 20 },
    { date: 'Apr 15', calories: 2000, carbs: 240, protein: 85, fat: 68, sugar: 44, fiber: 19 },
    { date: 'Apr 20', calories: 1850, carbs: 225, protein: 80, fat: 62, sugar: 41, fiber: 16 },
    { date: 'Apr 25', calories: 2050, carbs: 245, protein: 88, fat: 69, sugar: 43, fiber: 17 },
    { date: 'Apr 30', calories: 1900, carbs: 230, protein: 83, fat: 64, sugar: 40, fiber: 18 },
  ];

  const macroAverages = [
    { name: 'Carbs', value: dailyStats.totalCarbs || 235, color: '#8884d8' },
    { name: 'Protein', value: dailyStats.totalProtein || 83, color: '#82ca9d' },
    { name: 'Fat', value: dailyStats.totalFat || 65, color: '#ffc658' },
    { name: 'Sugar', value: dailyStats.totalSugar || 42, color: '#ff8042' },
    { name: 'Fiber', value: dailyStats.totalFiber || 18, color: '#a4de6c' },
  ];

  // Calculate averages from weekly data
  const calculateAverages = () => {
    if (weeklyData.length === 0) return macroAverages;

    const totals = weeklyData.reduce((acc, day) => {
      return {
        carbs: acc.carbs + day.carbs,
        protein: acc.protein + day.protein,
        fat: acc.fat + day.fat,
        sugar: acc.sugar + day.sugar,
        fiber: acc.fiber + day.fiber,
      };
    }, { carbs: 0, protein: 0, fat: 0, sugar: 0, fiber: 0 });

    const count = weeklyData.length;

    return [
      { name: 'Carbs', value: Math.round(totals.carbs / count), color: '#8884d8' },
      { name: 'Protein', value: Math.round(totals.protein / count), color: '#82ca9d' },
      { name: 'Fat', value: Math.round(totals.fat / count), color: '#ffc658' },
      { name: 'Sugar', value: Math.round(totals.sugar / count), color: '#ff8042' },
      { name: 'Fiber', value: Math.round(totals.fiber / count), color: '#a4de6c' },
    ];
  };

  // Example meal breakdown - in a real app, you would derive this from your data
  const caloriesByMealType = [
    { name: 'Breakfast', calories: 450, percentage: 22.5 },
    { name: 'Lunch', calories: 650, percentage: 32.5 },
    { name: 'Dinner', calories: 700, percentage: 35 },
    { name: 'Snacks', calories: 200, percentage: 10 },
  ];

  const nutrientRadarData = [
    { nutrient: 'Carbs', fullMark: 300, value: dailyStats.totalCarbs || 235 },
    { nutrient: 'Protein', fullMark: 150, value: dailyStats.totalProtein || 83 },
    { nutrient: 'Fat', fullMark: 100, value: dailyStats.totalFat || 65 },
    { nutrient: 'Sugar', fullMark: 60, value: dailyStats.totalSugar || 42 },
    { nutrient: 'Fiber', fullMark: 30, value: dailyStats.totalFiber || 18 },
    { nutrient: 'Sodium', fullMark: 2400, value: 1200 },
  ];

  // Daily calorie goal
  const dailyCalorieGoal = 2100;

  // Calorie trends with goal line
  const calorieTrends = weeklyData.map(day => ({
    day: day.date,
    actual: day.calories,
    goal: dailyCalorieGoal
  }));

  // BMI data points for scatter plot (example data - would need actual measurements)
  const bmiMeasurements = [
    { date: 'Jan', bmi: 26.4 },
    { date: 'Feb', bmi: 26.1 },
    { date: 'Mar', bmi: 25.7 },
    { date: 'Apr', bmi: 25.3 },
    { date: 'May', bmi: 25.0 },
  ];

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserNutrition(user.id));
    }
  }, [dispatch, user]);

  // Custom actions for the header
  const headerActions = (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline">
        <Calendar className="mr-2 h-4 w-4" />
        Date Range
      </Button>
      <Button size="sm" variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button size="sm" variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  );

  const refreshData = () => {
    if (user?.id) {
      dispatch(fetchUserNutrition(user.id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full pl-0">
      <PageTitle title='Analytics' />
      <Header
        title="Nutrition Analytics"
        actions={headerActions}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics', isCurrent: true }
        ]}
      />

      <main className='flex flex-1 flex-col gap-4 p-4'>
        {/* Time range selector */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Nutrition Insights</h2>
            <p className="text-muted-foreground">Analyze your nutrition patterns and trends</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="ghost" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Key metrics row */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Daily Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.length > 0
                ? Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length)
                : 1950}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+2.5%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Protein Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.length > 0
                ? Math.round(weeklyData.reduce((sum, day) => sum + day.protein, 0) / weeklyData.length)
                : 83}g
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+4.7%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Sugar Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.length > 0
                ? Math.round(weeklyData.reduce((sum, day) => sum + day.sugar, 0) / weeklyData.length)
                : 42}g
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">-2.1%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length || 87}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.4%</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main charts (2 columns) */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Calorie trend chart */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Calorie Trends</CardTitle>
              <CardDescription>Daily calorie intake vs. goal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calorieTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      name="Actual Calories"
                    />
                    <Line
                      type="monotone"
                      dataKey="goal"
                      stroke="#ff7300"
                      name="Calorie Goal"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Macronutrient distribution */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Macronutrient Distribution</CardTitle>
              <CardDescription>Average intake breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculateAverages()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {macroAverages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}g`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="nutrition" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="nutrition">Nutrition Details</TabsTrigger>
            <TabsTrigger value="meals">Meal Analysis</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>

          {/* Nutrition Details Tab */}
          <TabsContent value="nutrition" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrient Balance</CardTitle>
                  <CardDescription>Radar view of key nutrients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={nutrientRadarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="nutrient" />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                        <Radar
                          name="Your Intake"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nutrient Trends</CardTitle>
                  <CardDescription>Historical nutrient intake</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={nutritionHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="carbs" stroke="#8884d8" />
                        <Line type="monotone" dataKey="protein" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="fat" stroke="#ffc658" />
                        <Line type="monotone" dataKey="sugar" stroke="#ff8042" />
                        <Line type="monotone" dataKey="fiber" stroke="#a4de6c" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Meal Analysis Tab */}
          <TabsContent value="meals" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Calories by Meal Type</CardTitle>
                  <CardDescription>Distribution across meal types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={caloriesByMealType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} calories`} />
                        <Bar dataKey="calories" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meal Percentage</CardTitle>
                  <CardDescription>Percentage of daily calories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={caloriesByMealType}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {caloriesByMealType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 60%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>BMI Tracking</CardTitle>
                  <CardDescription>Body Mass Index over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis type="category" dataKey="date" name="Month" />
                        <YAxis type="number" dataKey="bmi" name="BMI" domain={[24, 27]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="BMI Values" data={bmiMeasurements} fill="#8884d8">
                          {bmiMeasurements.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === bmiMeasurements.length - 1 ? '#ff7300' : '#8884d8'} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goal Achievement</CardTitle>
                  <CardDescription>Calories vs. daily goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={calorieTrends}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="actual" name="Actual Calories" fill="#8884d8" />
                        <Bar dataKey="goal" name="Calorie Goal" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default AnalyticsPage;