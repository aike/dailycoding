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
  ["20231030", "二つの正弦波ストライプをリング変調"],
  ["20231031", "二つの正弦波ストライプをFM変調"],
  ["20231101", "多数の正弦波ストライプをFM変調"],
  ["20231102", "多数の正弦波ストライプをFM変調と二値化"],
  ["20231103", "noise関数を二値化"],
  ["20231104", "流体っぽいアルゴリズムの二値化"],
  ["20231105", "多数の波紋をFM変調と二値化"],
  ["20231106", "多数の正弦波ストライプをFM変調と二値化後にエンボス化"],
  ["20231107", "回転を乱した高密度うずまきをグラデーションで描画"],
  ["20231108", "回転を乱したうずまき"],
  ["20231109", "ランダムウォークをエンボス化"],
  ["20231110", "水彩風模様にグリッチ"],
  ["20231111", "流体風模様にグリッチ"],
  ["20231112", "RGB値の交換と増幅によるグリッチ"],
  ["20231113", "矩形に切り抜き色変換後別の領域にブレンドを繰り返す"],
  ["20231114", "円形に切り抜き色変換後別の領域にブレンドを繰り返す"],
  ["20231115", "円形に切り抜きHSB値変換後別の領域にブレンドを繰り返す"],
  ["20231116", "アルファベットのグリッチ"],
  ["20231117", "ブラウン管風"],
  ["20231118", "流体模様にブラウン管グリッチ"],
  ["20231119", "矩形の再帰にブラウン管グリッチ"],
  ["20231120", "アルファベットに粗く揺らぐディザリング"],
  ["20231121", "流体模様に粗く揺らぐディザリング"],
  ["20231122", "カラフルなビネット"],
  ["20231123", "ビネットを加えたブラウン管グリッチ"],
  ["20231124", "ライフゲームアルゴリズムで半透明円を描画"], 
  ["20231125", "ライフゲームのある世代を交互にずらした半透明円で"], 
  ["20231126", "ライフゲームを半透明点で残像を残すよう描画"], 
  ["20231127", "残像付ライフゲーム"], 
  ["20231128", "ライフゲームのセルを右下からの直線で描画"], 
  ["20231129", "独自ルール多状態ライフゲーム"], 
  ["20231130", "ライフゲームのセルを中心からの直線で描画"], 
  ["20231201", "性別要素を追加した残像付ライフゲーム"], 
  ["20231202", "交配不可の種族要素を追加した残像付ライフゲーム"], 
  ["20231203", "三種類の種族要素を追加した残像付ライフゲーム"], 
  ["20231204", "性別を持つ種族と持たない種族が拮抗するライフゲーム"], 
  ["20231205", "チューリングパターン"], 
  ["20231206", "チューリングパターン＃２"], 
  ["20231207", "チューリングパターン＃３"], 
  ["20231208", "対称的なチューリングパターン"], 
  ["20231209", "二値化と影をつけた対称チューリングパターン"], 
  ["20231210", "無彩色の線による対称チューリングパターン"], 
  ["20231211", "二層のチューリングパターン"], 
  ["20231212", "二層のチューリングパターンのストライプ二値化"], 
  ["20231213", "二値化チューリングパターン"], 
  ["20231214", "二値化チューリングパターン＃２"], 
  ["20231215", "カラフルなチューリングパターン"], 
  ["20231216", "二値化チューリングパターン＃３"], 
  ["20231217", "橙色のチューリングパターン"], 
  ["20231218", "虹色のチューリングパターン"], 
  ["20231219", "虹色の流体"], 
  ["20231220", "二種類の虹色流体を合成"], 
  ["20231221", "二種類の流体を合成"], 
  ["20231222", "二種類の流体を合成＃２"], 
  ["20231223", "二種類の流体を合成して赤白緑で彩色"], 
  ["20231224", "赤白緑のチューリングパターン"], 
  ["20231225", "二種類のチューリングパターンを合成"], 
  ["20231226", "二種類のチューリングパターンを合成＃２"], 
  ["20231227", "二種類のチューリングパターンを合成＃３"], 
  ["20231228", "ダイアモンド－スクエア・アルゴリズム"], 
  ["20231229", "ダイアモンド－スクエア・アルゴリズム＋ガウシアンフィルター"], 
  ["20231230", "ダイアモンド－スクエア・アルゴリズム＋ガウシアンフィルター＃２"], 
  ["20231231", "ライフゲームの生の回数を可視化"], 
  ["20240101", "ライフゲームの統計値にフィルター適用"], 
  ["20240102", "ライフゲームの統計値を色付け"], 
  ["20240103", "ライフゲームの統計値を色付け＃２"], 
  ["20240104", "ランダムに移動するパーティクル"], 
  ["20240105", "煙パーティクル"], 
  ["20240106", "グラデーションするパーティクル"], 
  ["20240107", "カラフルなパーティクル"], 
];
