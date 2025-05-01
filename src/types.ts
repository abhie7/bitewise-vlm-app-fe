export interface User {
  uuid: string;
  email: string;
  userName: string;
}

export interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  isAuthError: string | null;
  isAuthSuccess: boolean;
  token: string | null;
}

import { NutritionState } from '@/services/nutritionService';

export interface RootState {
  auth: {
    user: any;
    isAuthenticated: boolean;
    isAuthSuccess: boolean;
    loading: boolean;
    error: string | null;
  };
  nutrition: NutritionState;
}

export interface NutritionState {
  items: NutritionItem[];
  loading: boolean;
  error: string | null;
  dailyStats?: {
    totalCalories: number;
    totalCarbs: number;
    totalProtein: number;
    totalFat: number;
    totalSugar: number;
    totalFiber: number;
  };
  weeklyData?: any[];
  monthlyData?: any[];
}

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
      total_fat: MacroNutrient;
      carbohydrates: MacroNutrient;
      protein: MacroNutrient;
      sodium?: MicroNutrient;
      calcium?: MicroNutrient;
      iron?: MicroNutrient;
      cholesterol?: MicroNutrient;
      [key: string]: MacroNutrient | MicroNutrient | undefined;
    };
    ingredients: string[] | null;
    allergens: string[] | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MacroNutrient {
  amount: number;
  unit: string;
  daily_value_percentage: number | null;
  group: string;
  category: string;
  sub_nutrients?: {
    [key: string]: {
      amount: number;
      unit: string;
      daily_value_percentage: number | null;
      group: string;
      category: string;
    };
  };
}

export interface MicroNutrient {
  amount: number;
  unit: string;
  daily_value_percentage: number | null;
  group: string;
  category: string;
}

// Chart component props
export interface ChartComponentProps {
  items: NutritionItem[];
  loading?: boolean;
}

