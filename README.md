# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```


so here is my data:

we can get the nutrition data from the state var items which is an array of objects consisting data. here is an example of what the data is and how is my schema is structured based on which you need to create all the charts.
[
    {
        "_id": "6812d31595b412e133421fe2",
        "userId": "58acca37-c2be-4ae9-b10f-8b9726c89533",
        "imageUrl": "https://10ff-2405-201-2012-1828-8de8-6fe8-3c4b-78b1.ngrok-free.app/bitewise-vlm-s3/58acca37-c2be-4ae9-b10f-8b9726c89533/1746064136572_label1.jpg",
        "imageId": "58acca37-c2be-4ae9-b10f-8b9726c89533/1746064136572_label1.jpg",
        "fileName": "label1.jpg",
        "fileType": "image/jpeg",
        "fileSize": 1257331,
        "foodName": "Food item",
        "calories": 553,
        "carbs": 52.6,
        "protein": 6.7,
        "fat": 35.1,
        "sugar": 0.6,
        "fiber": 0,
        "additionalInfo": "Serving size: 20 g\nSodium: 510mg",
        "rawAnalysisData": {
            "metadata": {
                "confidence_score": 95,
                "error_status": null
            },
            "product_details": {
                "serving_size": {
                    "amount": 20,
                    "unit": "g",
                    "type": null
                }
            },
            "total_calories": 553,
            "nutrients": {
                "total_fat": {
                    "amount": 35.1,
                    "unit": "g",
                    "daily_value_percentage": 10,
                    "group": "fats",
                    "category": "macronutrient",
                    "sub_nutrients": {
                        "saturated_fat": {
                            "amount": 6.2,
                            "unit": "g",
                            "daily_value_percentage": 6,
                            "group": "fats",
                            "category": "macronutrient"
                        },
                        "trans_fat": {
                            "amount": 0.1,
                            "unit": "g",
                            "daily_value_percentage": 1,
                            "group": "fats",
                            "category": "macronutrient"
                        }
                    }
                },
                "cholesterol": {
                    "amount": 0,
                    "unit": "mg",
                    "daily_value_percentage": null,
                    "group": "fats",
                    "category": "macronutrient"
                },
                "carbohydrates": {
                    "amount": 52.6,
                    "unit": "g",
                    "daily_value_percentage": null,
                    "group": "carbohydrates",
                    "category": "macronutrient",
                    "sub_nutrients": {
                        "dietary_fiber": {
                            "amount": 0,
                            "unit": "g",
                            "daily_value_percentage": null,
                            "group": "carbohydrates",
                            "category": "macronutrient"
                        },
                        "total_sugar": {
                            "amount": 0.6,
                            "unit": "g",
                            "daily_value_percentage": null,
                            "group": "carbohydrates",
                            "category": "macronutrient"
                        },
                        "added_sugar": {
                            "amount": 0,
                            "unit": "g",
                            "daily_value_percentage": 0,
                            "group": "carbohydrates",
                            "category": "macronutrient"
                        }
                    }
                },
                "protein": {
                    "amount": 6.7,
                    "unit": "g",
                    "daily_value_percentage": 6,
                    "group": "protein",
                    "category": "macronutrient"
                },
                "sodium": {
                    "amount": 510,
                    "unit": "mg",
                    "daily_value_percentage": 5,
                    "group": "mineral",
                    "category": "micronutrient"
                },
                "calcium": {
                    "amount": 0,
                    "unit": "mg",
                    "daily_value_percentage": null,
                    "group": "mineral",
                    "category": "micronutrient"
                },
                "iron": {
                    "amount": 0,
                    "unit": "mg",
                    "daily_value_percentage": null,
                    "group": "mineral",
                    "category": "micronutrient"
                },
                "vitamins": []
            },
            "ingredients": [
                "Potato",
                "Edible Vegetable Oil (Sunflower",
                "Palmolein Oil)",
                "lodised Salt",
                "Antioxidant (307b, 319)"
            ],
            "allergens": null
        },
        "createdAt": "2025-05-01T01:49:09.605Z",
        "updatedAt": "2025-05-01T01:49:09.605Z",
        "__v": 0
    },
    {
        "_id": "68127af7872413e2dedf4e23",
        "userId": "58acca37-c2be-4ae9-b10f-8b9726c89533",
        "imageUrl": "https://e84d-2405-201-2012-1828-bd29-731d-c540-b34d.ngrok-free.app/bitewise-vlm-s3/58acca37-c2be-4ae9-b10f-8b9726c89533/1746041583608_images.jpeg",
        "imageId": "58acca37-c2be-4ae9-b10f-8b9726c89533/1746041583608_images.jpeg",
        "fileName": "images.jpeg",
        "fileType": "image/jpeg",
        "fileSize": 12445,
        "foodName": "Food item",
        "calories": 240,
        "carbs": 65,
        "protein": 0,
        "fat": 0,
        "sugar": 65,
        "fiber": 0,
        "additionalInfo": "Serving size: 1 bottle\nSodium: 50mg",
        "rawAnalysisData": {
            "metadata": {
                "confidence_score": 95,
                "error_status": null
            },
            "product_details": {
                "serving_size": {
                    "amount": 1,
                    "unit": "bottle",
                    "type": null
                }
            },
            "total_calories": 240,
            "nutrients": {
                "total_fat": {
                    "amount": 0,
                    "unit": "g",
                    "daily_value_percentage": 0,
                    "group": "fats",
                    "category": "macronutrient",
                    "sub_nutrients": {
                        "saturated_fat": {
                            "amount": 0,
                            "unit": "g",
                            "daily_value_percentage": null,
                            "group": "fats",
                            "category": "macronutrient"
                        },
                        "trans_fat": {
                            "amount": 0,
                            "unit": "g",
                            "daily_value_percentage": null,
                            "group": "fats",
                            "category": "macronutrient"
                        }
                    }
                },
                "cholesterol": {
                    "amount": 0,
                    "unit": "mg",
                    "daily_value_percentage": null,
                    "group": "fats",
                    "category": "macronutrient"
                },
                "carbohydrates": {
                    "amount": 65,
                    "unit": "g",
                    "daily_value_percentage": 24,
                    "group": "carbohydrates",
                    "category": "macronutrient",
                    "sub_nutrients": {
                        "dietary_fiber": {
                            "amount": 0,
                            "unit": "g",
                            "daily_value_percentage": null,
                            "group": "carbohydrates",
                            "category": "macronutrient"
                        },
                        "total_sugar": {
                            "amount": 65,
                            "unit": "g",
                            "daily_value_percentage": null,
                            "group": "carbohydrates",
                            "category": "macronutrient"
                        },
                        "added_sugar": {
                            "amount": 65,
                            "unit": "g",
                            "daily_value_percentage": 129,
                            "group": "carbohydrates",
                            "category": "macronutrient"
                        }
                    }
                },
                "protein": {
                    "amount": 0,
                    "unit": "g",
                    "daily_value_percentage": null,
                    "group": "protein",
                    "category": "macronutrient"
                },
                "sodium": {
                    "amount": 50,
                    "unit": "mg",
                    "daily_value_percentage": 2,
                    "group": "mineral",
                    "category": "micronutrient"
                },
                "calcium": {
                    "amount": 0,
                    "unit": "mg",
                    "daily_value_percentage": null,
                    "group": "mineral",
                    "category": "micronutrient"
                },
                "iron": {
                    "amount": 0,
                    "unit": "mg",
                    "daily_value_percentage": null,
                    "group": "mineral",
                    "category": "micronutrient"
                },
                "vitamins": []
            },
            "ingredients": null,
            "allergens": null
        },
        "createdAt": "2025-04-30T19:33:11.108Z",
        "updatedAt": "2025-04-30T19:33:11.108Z",
        "__v": 0
    }
]

here are some items we can display, to fill out the gaps, and make the entire ui look better and comprehensive display more types and data from your side:
HIGH-LEVEL SUMMARY CARDS
Quick KPIs for a dashboard header:
- Total Food Items Logged
- Average Calories per Item
- Total Calories Consumed
- Total Fat / Carbs / Protein Consumed
- % of Daily Value Reached (for Sodium, Sugar, etc.)

CHARTS AND GRAPHS
1. Macro vs Micro Nutrients (Macro vs Micro)
Pie or Doughnut Chart

Split between macronutrients (fat, protein, carbs) and micronutrients (sodium, calcium, iron, vitamins).

Show their relative proportion per food item or across the dataset.

2. Macronutrient Composition Breakdown
Stacked Bar Chart / 100% Bar Chart

For each food item: show % of calories from carbs, fat, and protein.

Radar Chart

Compare nutrients across food items.

3. Sugar Breakdown
Stacked Bar

Total Sugar vs. Added Sugar vs. Dietary Fiber per item or per day.

4. Daily Calorie Trend
Line Chart / Area Chart

X-axis: Date (createdAt)

Y-axis: Total calories from all items consumed on that day.

Useful for trend tracking.

5. User Nutrient Intake Over Time
Line Graphs for each nutrient group

Fat, Carbs, Protein, Sodium, Sugar over time.

Useful for spotting patterns or spikes.

6. Top Ingredients Frequency
Word Cloud / Bar Chart

Count frequency of ingredients (across all logged items).

Show top 10 recurring ingredients.

FILTERS & SEGMENTATION OPTIONS
- Date range
- Specific nutrient (e.g., sodium-heavy items)

If you expand into analytics:
- Nutritional Goal Progress (against recommended daily intake)
- Anomaly Detection (spikes in added sugar/sodium)
- Food Quality Score (based on macro/micro balance)
- Calories per gram/ml Heatmap


note: i am using react typescript with shadcn/ui and tailwindcss.

here is my dashboard page:
import { PageTitle } from '../../components/ui/page-title'
import { Header } from '../../components/header/header'

export default function DashboardPage() {
  return (
    <>
      <PageTitle title='Dashboard' />
      <Header title='Dashboard' />
      <main className='flex flex-1 flex-col gap-4 p-4'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
        </div>
        <div className='min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
      </main>
    </>
  )
}

here is my analytics page
import { Header } from '@/components/header/header'

export default function AnalyticsPage() {
  return (
    <div className='flex flex-col min-h-screen w-full pl-0'>
      <Header
        title='Analytics Dashboard'
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics', isCurrent: true },
        ]}
      />

      <main className='flex flex-1 flex-col gap-4 p-4'>
        <div className='grid gap-4 md:grid-cols-2'></div>
      </main>
    </div>
  )
}

here is my nutrition slice:

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'

export interface NutritionItem {
  _id: string
  userId: string
  imageUrl: string
  imageId: string
  fileName: string
  fileType: string
  fileSize: number
  foodName: string
  calories: number
  carbs: number
  protein: number
  fat: number
  sugar: number
  fiber: number
  additionalInfo: string
  rawAnalysisData: {
    metadata: {
      confidence_score: number
      error_status: null | string
    }
    product_details: {
      serving_size: {
        amount: number
        unit: string
        type: null | string
      }
    }
    total_calories: number
    nutrients: {
      // Include any specific nutrients you want to access directly
      sodium?: {
        amount: number
        unit: string
        daily_value_percentage: number
      }
    }
  }
  createdAt: string
  updatedAt: string
}

export interface NutritionState {
  items: NutritionItem[]
  loading: boolean
  error: string | null
  dailyStats: {
    totalCalories: number
    totalCarbs: number
    totalProtein: number
    totalFat: number
    totalSugar: number
    totalFiber: number
  }
  weeklyData: any[]
  monthlyData: any[]
}

const initialState: NutritionState = {
  items: [],
  loading: false,
  error: null,
}

// Get nutrition data for a user
export const fetchUserNutrition = createAsyncThunk(
  'nutrition/fetchUserNutrition',
  async (token: string, { rejectWithValue }) => {
    try {
      // Use absolute URL instead of relative path to avoid Vite dev server interference
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/nutrition/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('Raw API response:', response.data)

      // Check if response has the expected data structure
      if (response.data && response.data.success && response.data.data) {
        toast.success(`${response.data.message}`)
        console.log('Nutrition data:', response.data.data)

        // Return the items array from the paginated response
        return response.data.data.items || []
      } else {
        console.error('Unexpected response format:', response.data)
        return rejectWithValue('Unexpected response format from the server')
      }
    } catch (error: any) {
      console.error('Error fetching nutrition data:', error)
      // Log more detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      }
      toast.error(`Failed to fetch nutrition data: ${error.message}`)
      return rejectWithValue(error.message)
    }
  }
)

// Add a new nutrition entry
export const addNutritionEntry = createAsyncThunk(
  'nutrition/addNutritionEntry',
  async (nutritionData: Partial<NutritionItem>, { rejectWithValue }) => {
    try {
      // Use absolute URL instead of relative path
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/nutrition`,
        nutritionData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(
              'socket_auth_token'
            )}`,
          },
        }
      )

      console.log('Raw API response:', response)

      if (response.data && response.data.success && response.data.data) {
        toast.success('Nutrition entry added successfully')
        return response.data.data
      } else {
        console.error('Unexpected response format:', response.data)
        return rejectWithValue('Unexpected response format from the server')
      }
    } catch (error: any) {
      console.error('Error adding nutrition entry:', error)
      // Log more detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      }
      toast.error(`Failed to add nutrition entry: ${error.message}`)
      return rejectWithValue(error.message)
    }
  }
)

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNutrition.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchUserNutrition.fulfilled,
        (state, action: PayloadAction<NutritionItem[]>) => {
          state.items = action.payload
          state.loading = false
        }
      )
      .addCase(fetchUserNutrition.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(
        addNutritionEntry.fulfilled,
        (state, action: PayloadAction<NutritionItem>) => {
          state.items.push(action.payload)
        }
      )
  },
})

export default nutritionSlice.reducer
