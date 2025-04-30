import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface NutritionItem {
  _id: string;
  userId: string;
  imageUrl: string;
  imageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
  additionalInfo: string;
  rawAnalysisData: {
    metadata: {
      confidence_score: number;
      error_status: null | string;
    };
    product_details: {
      serving_size: {
        amount: number;
        unit: string;
        type: null | string;
      };
    };
    total_calories: number;
    nutrients: {
      // Include any specific nutrients you want to access directly
      sodium?: {
        amount: number;
        unit: string;
        daily_value_percentage: number;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface NutritionState {
  items: NutritionItem[];
  loading: boolean;
  error: string | null;
  dailyStats: {
    totalCalories: number;
    totalCarbs: number;
    totalProtein: number;
    totalFat: number;
    totalSugar: number;
    totalFiber: number;
  };
  weeklyData: any[];
  monthlyData: any[];
}

const initialState: NutritionState = {
  items: [],
  loading: false,
  error: null,
  dailyStats: {
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    totalSugar: 0,
    totalFiber: 0,
  },
  weeklyData: [],
  monthlyData: [],
};

// Get nutrition data for a user
export const fetchUserNutrition = createAsyncThunk(
  'nutrition/fetchUserNutrition',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/nutrition/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch nutrition data');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Add a new nutrition entry
export const addNutritionEntry = createAsyncThunk(
  'nutrition/addNutritionEntry',
  async (nutritionData: Partial<NutritionItem>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nutritionData),
      });
      if (!response.ok) {
        throw new Error('Failed to add nutrition entry');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Calculate daily stats from nutrition items
const calculateDailyStats = (items: NutritionItem[]) => {
  const today = new Date().toISOString().split('T')[0];
  const todayItems = items.filter(item =>
    new Date(item.createdAt).toISOString().split('T')[0] === today
  );

  return {
    totalCalories: todayItems.reduce((sum, item) => sum + item.calories, 0),
    totalCarbs: todayItems.reduce((sum, item) => sum + item.carbs, 0),
    totalProtein: todayItems.reduce((sum, item) => sum + item.protein, 0),
    totalFat: todayItems.reduce((sum, item) => sum + item.fat, 0),
    totalSugar: todayItems.reduce((sum, item) => sum + item.sugar, 0),
    totalFiber: todayItems.reduce((sum, item) => sum + item.fiber, 0),
  };
};

// Prepare weekly data for charts
const prepareWeeklyData = (items: NutritionItem[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return last7Days.map(date => {
    const dayItems = items.filter(item =>
      new Date(item.createdAt).toISOString().split('T')[0] === date
    );

    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: dayItems.reduce((sum, item) => sum + item.calories, 0),
      carbs: dayItems.reduce((sum, item) => sum + item.carbs, 0),
      protein: dayItems.reduce((sum, item) => sum + item.protein, 0),
      fat: dayItems.reduce((sum, item) => sum + item.fat, 0),
      sugar: dayItems.reduce((sum, item) => sum + item.sugar, 0),
      fiber: dayItems.reduce((sum, item) => sum + item.fiber, 0),
    };
  });
};

// Prepare monthly data for charts
const prepareMonthlyData = (items: NutritionItem[]) => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return last30Days.map(date => {
    const dayItems = items.filter(item =>
      new Date(item.createdAt).toISOString().split('T')[0] === date
    );

    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: dayItems.reduce((sum, item) => sum + item.calories, 0),
    };
  });
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNutrition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserNutrition.fulfilled, (state, action: PayloadAction<NutritionItem[]>) => {
        state.items = action.payload;
        state.loading = false;
        state.dailyStats = calculateDailyStats(action.payload);
        state.weeklyData = prepareWeeklyData(action.payload);
        state.monthlyData = prepareMonthlyData(action.payload);
      })
      .addCase(fetchUserNutrition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addNutritionEntry.fulfilled, (state, action: PayloadAction<NutritionItem>) => {
        state.items.push(action.payload);
        state.dailyStats = calculateDailyStats(state.items);
        state.weeklyData = prepareWeeklyData(state.items);
        state.monthlyData = prepareMonthlyData(state.items);
      });
  },
});

export default nutritionSlice.reducer;
