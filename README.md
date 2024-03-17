# Open-Spot-AR

This program is free of charge. It is an open source project. It is a wonderful project that allows Japanese people to create an audio guide for your country while you are in Japan. You can link location information with audio, images, video, and other content. You can have native speakers of your country's language from all over the world produce a tour guide for you without ever leaving your location. This is a wonderful thing. Please use it to contribute to your local community and provide attractive content. Since this project is **MIT licensed**, it is very free to use and expand unlimited ideas.

 JavaScriptだけで動作するシンプルな地点ARです。HTMLとJavaScriptのみで実装していますので、イベントやスポットごとに改修が簡単です。

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

2023年12月19日
