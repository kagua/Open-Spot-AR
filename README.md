![オープンスポット](https://github.com/kagua/Open-Spot-AR/assets/631291/76f41f7a-1d38-4574-b645-4ca07737bda3)

# Open-Spot-AR
 JavaScriptだけで動作するシンプルな地点ARです。HTMLとJavaScriptのみで実装していますので、イベントやスポットごとに改修が簡単です。

![Screenshot_20231218-220830](https://github.com/kagua/Simple-Spot-AR/assets/631291/cb8728d9-87fc-44d1-9b30-7c4b5ced09bd)

## オープン音声AR「オープンスポットAR」

とにかくシンプルに実装できる地点ARを作りました。サーバーにHTMLファイルと、その地点で動作させたい画像や音声や動画を連動させるだけで、とりあえずスポットガイド的には使えると思います。GPS精度はブラウザ由来なのであまり期待しないでください。

**現在地を取得して特定地点との距離を表示するJavaScript**

https://www.kagua.biz/tool/javascript-tool/20231219a1.html

## サンプル

渋谷のハチ公の緯度経度をあらかじめセットしてあります。ハチ公像の近く10m以内でタップしますと、「ビンゴ！」とメッセージが出て、サンプルボイスが自動的に流れます。

それ以外ですと、誤差をmで表示してくれます。

**ハチ公銅像までの距離**

https://www.kagua.biz/panpan/

## 仕組み

- JavaScriptで緯度経度を取得
- 指定の緯度経度との距離を算出
- 差が10メートル以内なら、サンプルMP3を自動再生
- 現状は同一地点でリロードすると1～5mの誤差を確認

## ロードマップ

- 複数地点登録
- スポット侵入でBGM自動再生&ループ
- スポット侵入で再生ボタン表示
- 再生ボタン全ロック解除で終了メッセージ
- スポット離脱でBGM自動終了
- ロゴ作成
- サンプルボイス一般募集
- キャラクター作成

2023年12月19日
