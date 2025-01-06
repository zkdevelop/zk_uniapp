import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API 端点常量
const API_ENDPOINT = '/api/contacts';

// 获取联系人的异步 thunk
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      // 检查缓存的联系人数据
      const cachedContacts = checkForCachedContacts();
      if (cachedContacts) {
        return cachedContacts;
      }

      // 从 API 获取联系人数据
      const response = await axios.get(API_ENDPOINT);
      return response.data;
    } catch (error) {
      // 返回错误信息
      return rejectWithValue(error.message);
    }
  }
);

// 联系人 slice
const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: [],
    status: 'idle', // 状态：'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // 其他 reducers 可以在这里添加
  },
  extraReducers: (builder) => {
    builder
      // 处理 pending 状态
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      // 处理 fulfilled 状态
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = action.payload;
      })
      // 处理 rejected 状态
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// 检查缓存联系人的函数
const checkForCachedContacts = () => {
  // 这里应该实现实际的缓存检查逻辑
  return null;
};

// 导出 reducer
export default contactsSlice.reducer;

