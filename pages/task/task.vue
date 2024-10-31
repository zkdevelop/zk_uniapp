<template>
    <view class="container">
        <view class="topTabBar">
            <view class="grid" v-for="(item, tbIndex) in handlingType" :key="tbIndex" @tap="showType(tbIndex)">
                <view class="text" :class="[tbIndex === tabbarIndex ? 'active' : '']">{{ item.value }}</view>
            </view>
        </view>
        <view class="" style="margin-top: 100upx; padding: 0 20upx;">
            <block v-if="tabbarIndex === 0">
                <view class="" v-for="(item, index) in allItems" :key="index">
                    <!-- <text>{{ item }}</text> -->
					<view @click="goToDetail(item.type)" class="task_item">
						<view class="item_top">
							<view><text>{{item.task_name}}</text></view>
							<view><text :style="{background: getColor(item.type)}">{{getTypeString(item.type)}}</text></view>
						</view>
						<view class="item_bottom">
							<view><image src="../../static/icon/location_grey.png" style="width: 15px; height: 15px;"></image></view>
							<view style="margin-left: 7px;"><text style="line-height: 20px; text-align: center;">{{item.position}}</text></view>
						</view>
						<view class="item_bottom">
							<view><image src="../../static/icon/time_grey.png" style="width: 16px; height: 16px;"></image></view>
							<view style="margin-left: 7px;"><text>{{item.start_time}} - {{item.end_time}}</text></view>
						</view>
					</view>
                </view>
            </block>
            <block v-if="tabbarIndex === 1">
                <view class="" v-for="(item, index) in unstartedItems" :key="index">
                    <view @click="goToDetail(item.type)" class="task_item">
                    	<view class="item_top">
                    		<view><text>{{item.task_name}}</text></view>
                    		<view><text :style="{background: getColor(item.type)}">{{getTypeString(item.type)}}</text></view>
                    	</view>
                    	<view class="item_bottom">
                    		<view><image src="../../static/icon/location_grey.png" style="width: 15px; height: 15px;"></image></view>
                    		<view style="margin-left: 7px;"><text style="line-height: 20px; text-align: center;">{{item.position}}</text></view>
                    	</view>
                    	<view class="item_bottom">
                    		<view><image src="../../static/icon/time_grey.png" style="width: 16px; height: 16px;"></image></view>
                    		<view style="margin-left: 7px;"><text>{{item.start_time}} - {{item.end_time}}</text></view>
                    	</view>
                    </view>
                </view>
            </block>
            <block v-if="tabbarIndex === 2">
                <view class="" v-for="(item, index) in ongoingItems" :key="index">
                    <view @click="goToDetail(item.type)" class="task_item">
                    	<view class="item_top">
                    		<view><text>{{item.task_name}}</text></view>
                    		<view><text :style="{background: getColor(item.type)}">{{getTypeString(item.type)}}</text></view>
                    	</view>
                    	<view class="item_bottom">
                    		<view><image src="../../static/icon/location_grey.png" style="width: 15px; height: 15px;"></image></view>
                    		<view style="margin-left: 7px;"><text style="line-height: 20px; text-align: center;">{{item.position}}</text></view>
                    	</view>
                    	<view class="item_bottom">
                    		<view><image src="../../static/icon/time_grey.png" style="width: 16px; height: 16px;"></image></view>
                    		<view style="margin-left: 7px;"><text>{{item.start_time}} - {{item.end_time}}</text></view>
                    	</view>
                    </view>
                </view>
            </block>
            <block v-if="tabbarIndex === 3">
                <view class="" v-for="(item, index) in completedItems" :key="index">
                    <view @click="goToDetail(item.type)" class="task_item">
                    	<view class="item_top">
                    		<view><text>{{item.task_name}}</text></view>
                    		<view><text :style="{background: getColor(item.type)}">{{getTypeString(item.type)}}</text></view>
                    	</view>
                    	<view class="item_bottom">
                    		<view><image src="../../static/icon/location_grey.png" style="width: 15px; height: 15px;"></image></view>
                    		<view style="margin-left: 7px;"><text style="line-height: 20px; text-align: center;">{{item.position}}</text></view>
                    	</view>
                    	<view class="item_bottom">
                    		<view><image src="../../static/icon/time_grey.png" style="width: 16px; height: 16px;"></image></view>
                    		<view style="margin-left: 7px;"><text>{{item.start_time}} - {{item.end_time}}</text></view>
                    	</view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentTime: new Date(),
            taskItem: [],
            tabbarIndex: 0,
            handlingType: [
                { value: '全部' },
                { value: '未开始' },
                { value: '进行中' },
                { value: '已完成' }
            ],
            allItems: [],
            unstartedItems: [],
            ongoingItems: [],
            completedItems: []
        };
    },
    mounted() {
        this.initializeTasks(); // 初始化任务
    },
    computed: {
        upcomingTasks() {
            return this.filterUpcomingTasks();
        },
        comingTasks() {
            return this.filterComingTasks();
        },
        endedTasks() {
            return this.filterEndedTasks();
        }
    },
    methods: {
        initializeTasks() {
            this.taskItem = [
                { task_name: '现地侦察横须滨基地情况', country: '日本', position: '日本横须滨', start_time: '2024.05.03', end_time: '2026.02.01', type: this.getTaskType('2024.05.03', '2026.02.01'), description: '描述1' },
                { task_name: '台风情况管控', country: '日本',position: '台湾省台北市', start_time: '2025.05.03', end_time: '2026.03.01', type: this.getTaskType('2025.05.03', '2026.03.01'), description: '描述1' },
                { task_name: '其他任务示例', country: '日本',position: '位置A', start_time: '2024.06.01', end_time: '2024.12.01', type: this.getTaskType('2024.06.01', '2024.12.01') , description: '描述1'},
                { task_name: '任务示例1', country: '日本',position: '位置B', start_time: '2023.10.01', end_time: '2024.05.01', type: this.getTaskType('2023.10.01', '2024.05.01'), description: '描述1' },
                { task_name: '任务示例2', country: '日本',position: '位置C', start_time: '2023.12.01', end_time: '2024.08.01', type: this.getTaskType('2023.12.01', '2024.08.01'), description: '描述1' },
                { task_name: '任务示例3', country: '日本',position: '位置D', start_time: '2024.04.01', end_time: '2024.11.01', type: this.getTaskType('2024.04.01', '2024.11.01'), description: '描述1' },
                { task_name: '任务示例4', country: '日本',position: '位置E', start_time: '2023.09.01', end_time: '2024.03.01', type: this.getTaskType('2023.09.01', '2024.03.01'), description: '描述1' },
                { task_name: '任务示例5', country: '日本',position: '位置F', start_time: '2025.01.01', end_time: '2025.07.01', type: this.getTaskType('2025.01.01', '2025.07.01'), description: '描述1' },
            ];

            this.allItems = this.taskItem;
            this.unstartedItems = this.filterUpcomingTasks();
            this.ongoingItems = this.filterComingTasks();
            this.completedItems = this.filterEndedTasks();
        },
        getTaskType(startTime, endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            if (this.currentTime < start) {
                return "1"; // 未开始
            } else if (this.currentTime >= start && this.currentTime <= end) {
                return "2"; // 进行中
            } else {
                return "3"; // 已完成
            }
        },
		getTypeString(type) {
			switch (type) {
				case '1':
					return '未开始';
				case '2':
					return '进行中';
				case '3':
					return '已完成';
			}
		},
		getColor(type) {
			switch (type) {
				case "1":
					return '#ffcccc'; // 未开始
				case "2":
					return '#ccffcc'; // 进行中
				case "3":
					return '#dadada'; // 已完成
				default:
					return '#ffffff'; // 默认颜色
			}
		},
        showType(tbIndex) {
            this.tabbarIndex = tbIndex;
            console.info(this.tabbarIndex);
        },
        filterUpcomingTasks() {
            return this.taskItem.filter(item => item.type === '1');
        },
        filterComingTasks() {
            return this.taskItem.filter(item => item.type === '2');
        },
        filterEndedTasks() {
            return this.taskItem.filter(item => item.type === '3');
        },
		goToDetail(type){
			uni.navigateTo({
				url: `/pages/task/task_detail/task_detail?taskItem=${type}`
			});
		}
    }
};

</script>

<style lang="scss">
.topTabBar {
    width: 100%;
    height: 80upx;
    display: flex;
    justify-content: space-around;
    position: fixed;
	top: 0vh;
    background-color: #f8f8f8;
	z-index: 10;
}
.grid {
    width: 20%;
    height: 80upx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #444;
    font-size: 28upx;
}
.text {
    height: 76upx;
    display: flex;
    align-items: center;
}
.active {
    color: #0a79ff;
    border-bottom: solid 4upx #0a79ff;
}
.task_item {
	box-sizing: border-box; /* 包括内边距和边框 */
	width: 100%;
	height: 110px;
	// background: #0a79ff;
	border-radius: 3px;
	margin-bottom: 20px;
	box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2); /* 水平偏移、垂直偏移、模糊半径、颜色 */
	padding: 10px;
}
.item_top {
	height: 30px;
	display: flex;
	justify-content: space-between; /* 两侧分开 */
	border-bottom: 1px solid grey;
}
.item_bottom {
	height: 20px;
	display: flex;
	margin-top: 10px;
}
</style>
