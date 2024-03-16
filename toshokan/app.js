//HTML
const getLocation = document.getElementById('getLocation');
const positionsDiv = document.getElementById('positions');
const stationsDiv = document.getElementById('stations');
const navigationButton = document.getElementById('startNavigation'); // 名前を変更して一貫性を保持
const audio = document.getElementById('audio');
const selectedStationDiv = document.getElementById('selectedStation');

let chosenStation = null;
let positionHistory = [];
let watchId = null; // 位置情報の監視IDを格納
let navigating = false; // ナビゲーションが進行中かどうかを追跡
const arrivalThreshold = 0.1; // 図書館までの閾値距離（キロメートル単位）


// 現在地を取得し、取得した緯度経度を表示します。
getLocation.onclick = () => {
    positionHistory = [];
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId); // 既存の監視をクリア
        watchId = null;
    }
    watchId = navigator.geolocation.watchPosition(position => {
        positionHistory.push(position);
        displayPositions(positionHistory); // 取得した緯度経度を表示する関数を呼び出し
        if (positionHistory.length === 3) {
            navigator.geolocation.clearWatch(watchId); // 5回計測したら監視を停止
            positionsDiv.innerHTML += `どの図書館に行きますか？`;
            watchId = null;
            getLocation.disabled = true; // 「現在地を取得する」ボタンを無効化
            getLocation.style.backgroundColor = "#CCCCCC"; // ボタンをグレイアウト
            const medianPosition = getMedianPosition(positionHistory);
            getNearbyStations(medianPosition);
        }
    }, null, { enableHighAccuracy: true });
};

// 取得した緯度経度を表示する関数
function displayPositions(positions) {
    positionsDiv.innerHTML = ''; // 既存のリストをクリア
    positions.forEach((position, index) => {
        const lat = position.coords.latitude.toFixed(5); // 緯度
        const lng = position.coords.longitude.toFixed(5); // 経度
        positionsDiv.innerHTML += `計測${index + 1}: [${lat}, ${lng}]<br>`; // リストに追加
    });
}


function getMedianPosition(positions) {
    const sortedLat = positions.map(p => p.coords.latitude).sort();
    const sortedLng = positions.map(p => p.coords.longitude).sort();
    const midIndex = Math.floor(sortedLat.length / 2);
    return { latitude: sortedLat[midIndex], longitude: sortedLng[midIndex] };
}

// 図書館情報を取得して表示する関数
async function getNearbyStations(medianPosition) {
    const requestUrl = `https://api.calil.jp/library?appkey=ed5c07e8ad060f9465845361274453aa&geocode=${medianPosition.longitude},${medianPosition.latitude}&limit=5&format=json&callback=no`;
    const response = await fetch(requestUrl);
    const libraries = await response.json(); // JSONを解析
        // 各図書館に対して緯度と経度のプロパティを追加
    libraries.forEach(library => {
        const [longitude, latitude] = library.geocode.split(',').map(coord => parseFloat(coord));
        library.latitude = latitude;
        library.longitude = longitude;
    });
    displayStations(libraries); // 修正: 正しい配列を関数に渡す
}

// 取得した図書館情報を表示する関数
function displayStations(stations) {
    stationsDiv.innerHTML = ''; // 既存のリストをクリア
    stations.forEach((station, index) => {
        // label要素の作成
        const label = document.createElement('label');
        label.style.backgroundColor = '#fff59d'; // 明るい黄色
        label.style.padding = '5px';
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.borderRadius = '5px';
        label.style.cursor = 'pointer';
        label.style.fontSize = '14px';
        
        // checkbox要素の作成
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `station${index}`;
        checkbox.name = 'station';
        checkbox.value = JSON.stringify({name: station.formal, latitude: station.latitude, longitude: station.longitude, distance: station.distance}); // 修正: 適切なプロパティに更新

        // ラベルのテキスト部分を設定
        label.htmlFor = `station${index}`;
        label.textContent = `${station.formal} (${station.distance ? Math.round(station.distance*10)/10 : ''}km) [${station.geocode}]`; // 修正: テキストを更新
        
        // チェックボックスをラベルに追加
        label.insertBefore(checkbox, label.firstChild); // チェックボックスをラベルの最初に挿入
        
        // 最終的にラベルをstationsDivに追加
        stationsDiv.appendChild(label);
    });
}



// 駅を選択すると、選択された駅の情報を表示し、「駅に向かう」ボタンを表示します。
stationsDiv.onclick = (e) => {
    if (e.target.type === 'checkbox') {
        chosenStation = JSON.parse(e.target.value);
        selectedStationDiv.innerHTML = `${chosenStation.name}に行くね。`;
        selectedStationDiv.style.display = 'block';
        navigationButton.style.display = 'block'; // 修正部分
        console.log(chosenStation.name);
        console.log(chosenStation.latitude);
        console.log(chosenStation.longitude);
        console.log(chosenStation.distance);
    }
};


// 「駅に向かう/中断する」ボタンのクリックイベント
navigationButton.onclick = () => {
    if (!navigating) {
        // ナビゲーションを開始
        positionsDiv.style.display = 'none'; // 計測表示を非表示
        stationsDiv.style.display = 'none'; // 選択した駅の情報を非表示
        navigating = true;
        navigationButton.textContent = '中断する…'; // ボタンのテキストを変更

        // ここから音声読み上げ機能を追加
        const utterance = new SpeechSynthesisUtterance(`うん、よぉぉぉーし！${chosenStation.name}へ、向かおうーー！`);
        speechSynthesis.speak(utterance);

        startNavigation(); // ナビゲーションを開始する関数を呼び出し
    } else {
        // ナビゲーションを中断
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId); // 位置情報の監視を停止
            watchId = null;
        }
        navigating = false;
        navigationButton.textContent = '図書館へ向かう'; // ボタンのテキストを元に戻す
        selectedStationDiv.innerHTML = ''; // 現在地情報をクリア
    }
};


function startNavigation() {
    watchId = navigator.geolocation.watchPosition(position => {
        const currentPos = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        const distance = calculateDistance(currentPos, { latitude: chosenStation.latitude, longitude: chosenStation.longitude });
        if (distance < arrivalThreshold) { // 駅に120メートル以内
            audio.style.display = 'block'; // 音声案内を表示

            // 以下、追加された処理
            navigationButton.disabled = true; // 「中断する」ボタンを無効化
            navigationButton.style.backgroundColor = "#CCCCCC"; // ボタンをグレイアウト
            selectedStationDiv.innerHTML += `<br><b> ${chosenStation.name}に着いた！音声を再生してね。</b>`; // メッセージを表示

            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId); // 位置情報の取得を停止
                watchId = null;
            }
            navigating = false; // ナビゲーションを終了
        } else {
            // ユーザーがまだ駅に着いていない場合は、位置と残り距離を更新
            selectedStationDiv.innerHTML = `${chosenStation.name}に向かっています<br>現在地: [${currentPos.latitude.toFixed(5)}, ${currentPos.longitude.toFixed(5)}]<br>残り距離: ${(distance * 1000).toFixed(0)}m`;
        }
    }, null, { enableHighAccuracy: true });
}


function calculateDistance(pos1, pos2) {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = deg2rad(pos2.latitude - pos1.latitude);
    const dLon = deg2rad(pos2.longitude - pos1.longitude);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(pos1.latitude)) * Math.cos(deg2rad(pos2.latitude)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

