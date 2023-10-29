const imgs = [
  ["20230901", "矩形の再帰"],
  ["20230902", "sin関数で波線"],
  ["20230903", "noise関数"],
  ["20230904", "格子を円形にマスク"],
  ["20230905", "vertexで星形にマスク"],
  ["20230906", "curveVertexでゆがんだ星形"],
  ["20230907", "curveVertexとnoiseの組み合わせ"],
  ["20230908", "filterでボケ効果"],
  ["20230909", "rotateで回転"],
  ["20230910", "三角関数とimage関数で回転"],
  ["20230911", "放射状の図形でうずまき"],
  ["20230912", "うずまきを円形にマスク"],
  ["20230913", "noiseをfloorで階段状に色分け"],
  ["20230914", "noiseとfloorで色分けして境界を縁取り"],
  ["20230915", "シンプルな矩形の再帰"],
  ["20230916", "矩形の再帰に回転を加える"],
  ["20230917", "シンプルな円の再帰"],
  ["20230918", "円の中心をずらして回転させながら再帰"],
  ["20230919", "裏画面からコピーすることで矩形からはみだす円を描画"],
  ["20230920", "正方形の中点を結ぶ正方形を再帰"],
  ["20230921", "シンプルな正方形"],
  ["20230922", "立体的な正方形"],
  ["20230923", "影の描画"],
  ["20230924", "ボロノイ図"],
  ["20230925", "各セル内をボロノイ分割"],
  ["20230926", "noiseの出力を二値化、境界をわずかにグラデーション"],
  ["20230927", "リサジュー図形"],
  ["20230928", "noiseの二値化レイヤーを2回重ねる"],
  ["20230929", "FM変調波形でリサジュー図形"],
  ["20230930", "加算合成でスピログラフ風"],
  ["20231001", "トロコイド曲線でスピログラフ"],
  ["20231002", "ランダムな半透明円の重ね合わせ"],
  ["20231003", "トロコイド曲線をFM変調"],
  ["20231004", "うずまき"],
  ["20231005", "枠からはみ出すうずまき"],
  ["20231006", "うずまきをリング変調"],
  ["20231007", "うずまきを強めにリング変調"],
  ["20231008", "シェーダー芸でよく見る名前のわからない流体っぽいアルゴリズム"],
  ["20231009", "振幅と透明度を変えながらリサジュー図形を描画"],
  ["20231010", "流体っぽいアルゴリズムのバリエーション"],
  ["20231011", "ボロノイ図の境界線を色付け"],
  ["20231012", "モザイクのグラデーション"],
  ["20231013", "ランダムな線"],
  ["20231014", "ランダムな並行線"],
  ["20231015", "ランダムウォーク"],
  ["20231016", "ランダムウォークのバリエーション"],
  ["20231017", "斜め移動も許可したランダムウォーク"],
  ["20231018", "斜め移動のみ許可したランダムウォーク"],
  ["20231019", "波紋の干渉"],
  ["20231020", "波紋の干渉をFM合成"],
  ["20231021", "正規乱数の位置に指数乱数の大きさの円"],
  ["20231022", "正規乱数の２点を結ぶ直線"],
  ["20231023", "うずまきを多重に描画"],
  ["20231024", "複数のうずまき"],
  ["20231025", "正規乱数のモザイク"],
  ["20231026", "ランダムな軌跡の曲線"],
  ["20231027", "noiseでエリア分けしてストライプ模様描画"],
  ["20231028", "イクラの醤油漬けを待つ間に"],
  ["20231029", "正弦波でストライプ模様を生成"],
];
  