<template>
  <view class="group-chat-container">
    <!-- 顶部导航栏 -->
    <uni-nav-bar
      :fixed="true"
      status-bar
      left-icon="left"
      @clickLeft="handleBack"
      title="发起群聊"
    >
      <template #right>
        <view class="nav-right">
          <button
            class="complete-btn"
            :class="{ active: selectedContacts.length > 0 }"
            :disabled="selectedContacts.length === 0"
            @click="handleComplete"
          >
            完成
          </button>
        </view>
      </template>
    </uni-nav-bar>

    <!-- 搜索框 -->
    <view class="search-container">
      <view class="search-box">
        <image
          class="search-icon"
          src="/static/message/search.png"
          mode="aspectFit"
        ></image>
        <input
          class="search-input"
          type="text"
          v-model="searchKeyword"
          placeholder="搜索"
          @input="handleSearch"
        />
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading">加载中...</view>

    <!-- 联系人列表 -->
    <scroll-view v-if="!isLoading" class="contacts-list" scroll-y>
      <template v-if="filteredContacts.length > 0">
        <view v-for="letter in sortedLetters" :key="letter">
          <view class="letter-index">{{ letter }}</view>
          <view
            v-for="contact in groupedContacts[letter]"
            :key="contact.id"
            class="contact-item"
            @click="toggleSelect(contact)"
          >
            <checkbox
              :checked="isSelected(contact.id)"
              :value="contact.id"
              class="checkbox"
            />
            <image
              class="avatar"
              :src="contact.avatarUrl || '/static/message/defaultimg.png'"
              mode="aspectFill"
            ></image>
            <text class="contact-name">{{ contact.name }}</text>
          </view>
        </view>
      </template>
      <view v-else class="no-results">
        <text>无搜索结果</text>
      </view>
    </scroll-view>

    <!-- 群聊名称输入弹窗 -->
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        title="设置群聊名称"
        mode="input"
        placeholder="请输入群聊名称"
        :before-close="true"
        @confirm="confirmGroupName"
        @close="closePopup"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useContactsStore } from "../../../store/contactsStore";
import { useUserStore } from "@/store/userStore";
import { pinyin } from "pinyin-pro";
import { createGroup } from "@/utils/api/contacts";
import { getMissionAddressBook } from "@/utils/api/message.js";

// 初始化store
const contactsStore = useContactsStore();
const userStore = useUserStore();

// 响应式状态
const searchKeyword = ref("");
const selectedContacts = ref([]);
const popup = ref(null);
const isLoading = ref(true);

// 在组件挂载时加载联系人数据
onMounted(async () => {
  console.log("创建群聊组件已挂载");
  isLoading.value = true;
  await loadCachedContacts();
  await fetchContacts();
  isLoading.value = false;
  nextTick(() => {
    // 在下一个 tick 中设置 scrollTop，确保 DOM 已更新
    const scrollView = document.querySelector(".contacts-list");
    if (scrollView) {
      scrollView.scrollTop = 0;
    }
  });
});

// 过滤并计算联系人列表
const filteredContacts = computed(() => {
  const contacts = contactsStore.userInformationVOList || [];
  if (!searchKeyword.value) return contacts;
  return contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

// 获取拼音首字母
const getFirstLetter = (name) => {
  const pinyinResult = pinyin(name, { pattern: "first", toneType: "none" });
  return pinyinResult.charAt(0).toUpperCase();
};

// 按字母分组联系人
const groupedContacts = computed(() => {
  const groups = {};
  filteredContacts.value.forEach((contact) => {
    const firstLetter = getFirstLetter(contact.name);
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(contact);
  });
  return groups;
});

// 排序后的字母数组
const sortedLetters = computed(() => {
  return Object.keys(groupedContacts.value).sort();
});

// 处理返回按钮点击
const handleBack = () => {
  console.log("返回按钮被点击");
  navigateToContacts();
};

// 处理搜索输入
const handleSearch = () => {
  // 搜索功能已通过计算属性实现
};

// 切换联系人选中状态
const toggleSelect = (contact) => {
  const index = selectedContacts.value.findIndex((c) => c.id === contact.id);
  if (index === -1) {
    selectedContacts.value.push(contact);
  } else {
    selectedContacts.value.splice(index, 1);
  }
  console.log("已选择的联系人:", selectedContacts.value);
};

// 检查联系人是否被选中
const isSelected = (contactId) => {
  return selectedContacts.value.some((contact) => contact.id === contactId);
};

// 处理完成按钮点击
const handleComplete = () => {
  if (selectedContacts.value.length === 0) return;

  // 显示群聊名称输入弹窗
  popup.value.open();
};

// 确认群聊名称
const confirmGroupName = (name) => {
  if (!name) {
    uni.showToast({
      title: "群聊名称不能为空",
      icon: "none",
    });
    return;
  }

  // 准备创建群聊的参数
  const groupData = {
    groupMemberIds: [...selectedContacts.value.map((contact) => contact.id)],
    groupName: name,
    missionId: userStore.state.missionId[0],
  };
  console.log(groupData, "groupData");
  // 调用创建群聊的API
  createGroup(groupData, groupData.missionId)
    .then((response) => {
      console.log("群聊创建成功:", response);
      uni.showToast({
        title: "群聊创建成功",
        icon: "success",
      });
      // 增加联系人更新计数器
      contactsStore.incrementContactsUpdateCounter();
      console.log("群聊创建成功，准备返回");
      setTimeout(() => {
        navigateToContacts();
      }, 100); // 延迟1.5秒后返回，确保Toast消息显示完毕
    })
    .catch((error) => {
      console.log("创建群聊失败:", error);
      uni.showToast({
        title: "创建群聊失败",
        icon: "none",
      });
    });
};

// 关闭弹窗
const closePopup = () => {
  popup.value.close();
};

// 加载缓存的联系人数据
const loadCachedContacts = async () => {
  const cachedContacts = uni.getStorageSync("cachedContacts");
  if (cachedContacts) {
    contactsStore.setUserInformationVOList(JSON.parse(cachedContacts));
    console.log("已加载缓存的联系人数据");
  }
};

// 获取联系人数据
const fetchContacts = async () => {
  try {
    const response = await getMissionAddressBook(userStore.state.missionId[0]);
    if (response.code === 200) {
      contactsStore.setUserInformationVOList(
        response.data.userInformationVOList
      );
      uni.setStorageSync(
        "cachedContacts",
        JSON.stringify(response.data.userInformationVOList)
      );
      console.log("已更新联系人数据");
    } else {
      throw new Error(response.msg || "获取联系人失败");
    }
  } catch (error) {
    console.log("获取联系人出错:", error);
    // uni.showToast({
    //   title: '获取联系人失败，请重试',
    //   icon: 'none'
    // })
  }
};

// 导航到联系人页面
const navigateToContacts = () => {
  console.log("准备导航到联系人页面");
  const pages = getCurrentPages();
  console.log(
    "当前页面栈:",
    pages.map((page) => page.route)
  );

  if (pages.length > 1) {
    uni.navigateBack({
      delta: 1,
      success: () => {
        console.log("成功返回到联系人页面");
      },
      fail: (error) => {
        console.log("返回失败:", error);
        fallbackToRedirect();
      },
    });
  } else {
    fallbackToRedirect();
  }
};

// 重定向到联系人页面的备选方案
const fallbackToRedirect = () => {
  console.log("尝试重定向到联系人页面");
  uni.redirectTo({
    url: "/pages/tabBar/tabBar",
    success: () => {
      console.log("成功重定向到联系人页面");
    },
    fail: (redirectError) => {
      console.log("重定向失败:", redirectError);
      console.log("尝试重新启动到联系人页面");
      uni.reLaunch({
        url: "/pages/tabBar/tabBar",
        success: () => {
          console.log("成功重新启动到联系人页面");
        },
        fail: (reLaunchError) => {
          console.log("重新启动失败:", reLaunchError);
        },
      });
    },
  });
};
</script>

<style scoped>
.group-chat-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.nav-right {
  padding-right: 12px;
}

.complete-btn {
  font-size: 14px;
  color: #999;
  background: none;
  border: none;
  padding: 4px 8px;
  margin: 0;
  line-height: 1.4;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.complete-btn.active {
  color: #007aff;
  opacity: 1;
}

.complete-btn:disabled {
  opacity: 0.6;
}

.complete-btn:after {
  border: none;
}

.search-container {
  padding: 10px 16px;
  background-color: #f5f5f5;
}

.search-box {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.contacts-list {
  flex: 1;
  background-color: #ffffff;
}

.letter-index {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.checkbox {
  margin-right: 12px;
  transform: scale(0.8);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
}

.contact-name {
  font-size: 16px;
  color: #333;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #999;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #999;
}

:deep(.uni-navbar__header) {
  border-bottom: 1px solid #eee;
}
</style>
