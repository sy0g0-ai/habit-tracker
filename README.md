# 習慣トラッカー

日々の習慣を記録・可視化するシンプルなWebアプリです。  
インストール不要、サーバー不要。ブラウザだけで動作します。

## 機能

- 習慣カードをタップするだけで達成を記録
- 連続記録（ストリーク）を自動集計（毎日目標 / 週1回目標に対応）
- 直近7日間の履歴をテーブルで一覧表示
- データはブラウザの `localStorage` に保存（ページを閉じても消えない）

## 使い方

**GitHub Pages（ライブデモ）:** https://sy0g0-ai.github.io/habit-tracker/

ローカルで動かす場合は `index.html` をブラウザで開くだけで起動します。

```bash
git clone https://github.com/sy0g0-ai/habit-tracker.git
cd habit-tracker
# index.html をブラウザで開く
```

## ファイル構成

```
habit-tracker/
├── index.html   # HTMLマークアップ
├── style.css    # スタイルシート
└── app.js       # アプリのロジック（習慣定義・描画・ストレージ）
```

## 動作環境

モダンブラウザ（Chrome / Firefox / Safari / Edge）に対応しています。

## データについて

すべての記録はブラウザの `localStorage` に保存されます。  
データは端末・ブラウザをまたいで同期されません。  
記録をリセットする場合は、ブラウザの開発者ツール（Application → Local Storage）から削除してください。

## ライセンス

MIT
