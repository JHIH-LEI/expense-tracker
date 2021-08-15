# expense-tracker 記帳簿

## 專案源起
用於練習express路由設定、資料庫CRUD操作

## 專案畫面
![](https://i.imgur.com/RwGGHAE.png)
![](https://i.imgur.com/ruNVs2S.jpg)
![](https://i.imgur.com/ttksq1E.png)
![](https://i.imgur.com/JCcDYJJ.png)
![](https://i.imgur.com/VbrI3eZ.png)

## 測試帳號
123@gmail.com
123
abc@gmail.com
123

## 功能
ps:記帳包含紀錄收入/支出

* 自動計算累積總金額
* 使用者能一覽自己的所有記帳
* 使用者能根據時間篩選自己的記帳
* 使用者能依照類別篩選自己的紀錄
* 使用者能觀看總支出/收入類別比

* 使用者能新增一筆記帳
* 使用者能新增屬於自己的支出/收入類別
* 類別新增成敗與否都有相應的提示
* 使用者能編輯一筆記帳
* 編輯頁會自動套入該筆資料
* 使用者能刪除一筆記帳

未開發：使用者能根據不同成員查看開銷狀況

## 環境
Node.js v10.15.0

## Dependencies

詳情請見package.json

登陸驗證：passport

資料視覺化：chart.js （使用CDN引入，放在main lyouts)

新增類別後的提示處理：connect-flash

日期相關處理：moment和自己寫的tools/dateFormat.js

## install
1. 打開你的 terminal，Clone 此專案至本機電腦

git clone https://github.com/JHIH-LEI/expense-tracker

2. 開啟終端機(Terminal)，進入存放此專案的資料夾

cd expense-tracker

3. 安裝 npm 套件
<img width="1122" alt="截圖 2021-08-15 下午4 36 45" src="https://user-images.githubusercontent.com/66233452/129472374-2f1e5a84-e24c-446a-a75c-14be44ddbc26.png">

在 Terminal 輸入 npm install 指令

4. .env.example改為.env

5. 如需使用FB/Google登陸，須先前往官網註冊登錄應用程式，並到.env中替換對應的value 

6. 啟動專案之前，先產生種子資料(類別與sample record)

npm run seed

7. 啟動專案

npm run dev

8. 當 terminal 出現以下字樣，表示成功連結本地伺服器：
![](https://i.imgur.com/WfCsnP7.png)
