/**
 * tetris
 */
const canvas = document.getElementById("canvas"); //canvas要素取得
const ctx = canvas.getContext('2d');

var Imino=[
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
];
var Lmino=[
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,1,0],
    [0,0,0,0,0]
];
var Jmino=[
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,1,0,0],
    [0,0,0,0,0]
];
var Tmino=[
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
];
var Omino=[
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
];
var Smino=[
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,1,1,0],
    [0,1,1,0,0],
    [0,0,0,0,0]
];
var Zmino=[
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,0,1,1,0],
    [0,0,0,0,0]
];
var minos=[
    Imino,Zmino,Tmino,Smino,Omino,Lmino,Jmino
];

canvas.width=300; //10マス
canvas.height=600; //20マス
const oneBrock=30; //１マス30px
var gameContinueFlg=true; //ゲーム継続フラグ
var points=0;
var now_points=[];  //現在の座標
var ex_points=[];  //移動後の座標
var mino=[];  //操作中のミノ配列
var moveX=4;  //移動値x
var moveY=-4;  //移動値y
var stage=[]; //ステージ
var c=0;  //moveY秒数カウンタ
var stage_tmp=[];  //描画用
var rightPressed=false;
var leftPressed=false;
var enterPressed=false;
var downPressed=false;
var lp=0; //キー押し込みカウンタ
var rp=0;
var ep=0;
var moveR_flg=true;
var moveL_flg=true;
var moveY_flg=true;

/**
 * ステージ初期値
 */
for(var st_y=0;st_y<canvas.height/oneBrock;st_y++){
    var stageR=[];
    for(st_x=0;st_x<canvas.width/oneBrock;st_x++){
        stageR[st_x]=0;
    }
    stage[st_y]=stageR;
}


/**
 * 操作ミノ配列選択
 */
function selectMino(){
    moveX=4; //初期化
    moveY=-4;
    random = Math.round( Math.random()*6 );
    mino=minos[random]; //今のミノ配列
}

/**
 *ミノ座標生成関数
 */
function makePoint(mino_arr,len){ //(ミノ配列,長さ,変化X,変化y)
    var points=[]; //ミノの座標
    var i=0;  //カウンタ

    for(var mp_y=0;mp_y<len;mp_y++){
        for(var mp_x=0;mp_x<len;mp_x++){
            if(mino_arr[mp_y][mp_x]==1){
                if(random!=4&&mp_x==2&&mp_y==2){
                    points[i]={
                        x:mp_x+moveX,
                        y:mp_y+moveY,
                        c:1
                    };
                }else{
                    points[i]={
                        x:mp_x+moveX,
                        y:mp_y+moveY,
                        c:0
                    };
                }
                i++;
            }
        }
    }
    return points;
}
/**
 * 座標加算関数
 */
function addPoint(add_arr,x,y){
    var add_arr_tmp=[];
    for(var add_i=0;add_i<add_arr.length;add_i++){
        add_arr_tmp[add_i]={
            x:add_arr[add_i].x+x,
            y:add_arr[add_i].y+y,
            c:add_arr[add_i].c
        }
    }
    return add_arr_tmp;
}


/**
 * 移動処理
 */
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
function keyDownHandler(e){
    if(e.keyCode==39){
        rightPressed = true;
    }else if(e.keyCode==37){
        leftPressed = true;
    }else if(e.keyCode==13){
        enterPressed=true;
    }else if(e.keyCode==40){
        downPressed=true;
    }
}
function keyUpHandler(e){
    if(e.keyCode==39){
        rightPressed = false;
    }else if(e.keyCode==37){
        leftPressed = false;
    }else if(e.keyCode==13){
        enterPressed=false;
    }else if(e.keyCode==40){
        downPressed=false;
    }
}
function move(){
    if(leftPressed){
        lp++;
    }
    if(rightPressed){
        rp++;
    }
    if(downPressed&&moveY_flg){
        c+=20;
    }
        if(lp>5){
            if(moveL_flg){
                moveX--;                
            }
            lp=0;  
        }
        if(rp>5){
            if(moveR_flg){
                moveX++;                
            }
            rp=0;
        }
        if(c<50){
            c++;
        }else{
            c=0;
            if(moveY_flg){
                moveY++;
            }else{
                gameContinue();
                makeStage();
                selectMino();
                deleteLine();
            }
        }
    moveL_flg=collision(addPoint(now_points,-1,0));
    moveR_flg=collision(addPoint(now_points,1,0));
    moveY_flg=collision(addPoint(now_points,0,1));
}

/**
 * 回転処理
 */
function turn(){
    var addX=0;
    var addY=0;
    var t_flg=true;
    var turn_points=[]; //回転後の座標
    var turn_arr=[]; //回転後のミノ配列
    if(enterPressed){
        ep++;
    }else{
        ep=0;
    }
    if(ep>8){
        ep=0;
        for(var ep_y=0;ep_y<mino.length;ep_y++){
            var turn_arr_R=[];
            for(var ep_x=0;ep_x<mino.length;ep_x++){
                turn_arr_R[ep_x]=mino[ep_x][mino.length-1-ep_y];
            }
            turn_arr[ep_y]=turn_arr_R;
        }
        //移動後座標
        turn_points=makePoint(turn_arr,turn_arr.length);
        if(collision(turn_points)){
            //mino[]更新
            for(var ep_c=0;ep_c<mino.length;ep_c++){
                mino[ep_c]=turn_arr[ep_c].slice();
            }
            //座標更新
            now_points=turn_points;
        }else{
            if(!collision(addPoint(turn_points,1,0))){ //右
                if(!collision(addPoint(turn_points,-1,0))){ //左
                    if(!collision(addPoint(turn_points,0,-1))){ //上
                        if(!collision(addPoint(turn_points,0,1))){ //下
                            if(!collision(addPoint(turn_points,1,-1))){ //右上
                                if(!collision(addPoint(turn_points,1,1))){ //右下
                                    if(!collision(addPoint(turn_points,-1,1))){ //左下
                                        if(!collision(addPoint(turn_points,-1,-1))){  //左上
                                            if(!collision(addPoint(turn_points,0))){ //右2
                                                if(!collision(addPoint(turn_points,-2,0))){ //左2
                                                    if(!collision(addPoint(turn_points,0,-2))){ //上2
                                                        if(!collision(addPoint(turn_points,0,2))){ //下2
                                                            t_flg=false;
                                                        }else{
                                                            addY+=2;
                                                        }
                                                    }else{
                                                        addY-=2;
                                                    }
                                                }else{
                                                    addX-=2;
                                                }
                                            }else{
                                                addX+=2;
                                            }
                                        }else{
                                            addX-=1;
                                            addY-=1;
                                        }
                                    }else{
                                        addX-=1;
                                        addY+=1;
                                    }
                                }else{
                                    addX+=1;
                                    addY+=1;
                                }
                            }else{
                                addX+=1;
                                addY-=1;
                            }
                        }else{
                            addY+=1;   
                        }
                    }else{
                        addY-=1;
                    }
                }else{
                    addX-=1;
                }
            }else{
                addX+=1;
            }
            if(t_flg){
                //mino[]更新
                for(var ep_c=0;ep_c<mino.length;ep_c++){
                    mino[ep_c]=turn_arr[ep_c].slice();
                }
                //移動値加算 
                moveX+=addX;
                moveY+=addY;
            }
        }        
    }
}

/**
 * 当たり判定関数
 * 移動後の座標（引数）が挿入可能か
 */
function collision(ex_points_a){
    var ex_c=0;
    //最底辺y座標
    //array.map()でオブジェクトの要素抜出
    var max_y=Math.max.apply(null,ex_points_a.map(function(o){return o.y;}));
    var max_x=Math.max.apply(null,ex_points_a.map(function(o){return o.x;}));
    var min_x=Math.min.apply(null,ex_points_a.map(function(o){return o.x;}));
    //エリア内にあるか
    if(min_x>=0&&max_x<=9&&max_y<=19){
        //ステージの座標に既にミノがあるか
        for(var ex_i=0;ex_i<ex_points_a.length;ex_i++){
            if(ex_points_a[ex_i].y>=0){
                if(stage[ex_points_a[ex_i].y][ex_points_a[ex_i].x]==1){
                    ex_c++;
                }
            }
        }
        if(ex_c==0){ //被り無
            return true;
        }
    }
    return false;
}



/**
 *stage_tmp[]操作
 */
function makeStageTmp(){
    //tmp初期化
    for(var mst_i=0;mst_i<stage.length;mst_i++){
        stage_tmp[mst_i]=stage[mst_i].slice();
    }
    now_points=makePoint(mino,mino.length); //今の座標
    for(var mst_k=0;mst_k<now_points.length;mst_k++){
        if(now_points[mst_k].y>=0){
            stage_tmp[now_points[mst_k].y][now_points[mst_k].x]=1;  
        }
    }
}
/**
 * stage[]操作
 */
function makeStage(){
    for(var ms_i=0;ms_i<stage.length;ms_i++){
        stage[ms_i]=stage_tmp[ms_i].slice();
    }
}

/**
 * 描画処理。
 * r行目c列目。
 * 1行づつx方向に生成
 */
function draw(){
    var stageMassOffsetY=0;
    for(var r=0;r<canvas.height/oneBrock;r++){ //行
        var stageMassOffsetX=0;
        for(var c=0;c<canvas.width/oneBrock;c++){ //列
            var massStatus = stage_tmp[r][c]; 
            if(massStatus==2){
                var color="#deb887";
            }else if(massStatus==0){
                var color="#b0c4de";
            }else if(massStatus==1){
                var color="#ff7f50"; 
            }else if(massStatus==99){
                var color="#ffd700"; 
            }
            ctx.beginPath();
            ctx.rect(stageMassOffsetX,stageMassOffsetY,oneBrock,oneBrock);
            ctx.fillStyle=color;
            ctx.fill();
            ctx.closePath();  
            stageMassOffsetX+=30;
        }
        stageMassOffsetY+=30;
    }
}

/**
 * ライン削除関数
 */
function deleteLine(){
    var new_line=[0,0,0,0,0,0,0,0,0,0];
    for(var dl_y=0;dl_y<20;dl_y++){
        var dl_c=0;
        for(var dl_x=0;dl_x<10;dl_x++){
            if(stage[dl_y][dl_x]==1){
                dl_c++;
            }
        }
        if(dl_c==10){
            var stage_0=[];
            points+=100;
            console.log(points);
            for(var dl_r=0;dl_r<dl_y+1;dl_r++){
                if(dl_r==0){
                    stage_0[0]=new_line
                }else{
                    stage_0[dl_r]=stage[dl_r-1].slice();
                }
            }
            for(var dl_i=0;dl_i<dl_y+1;dl_i++){
                stage[dl_i]=stage_0[dl_i].slice();
            }
            if(points>=300){
                gameContinueFlg=false;
                console.log('clear');
            }
        }
    }
}

/**
 * ゲームオーバー判定
 */
function gameContinue(){
    var gc_c=0;
    for(var gc_i=0;gc_i<now_points.length;gc_i++){
        if(now_points[gc_i].y<0){
            gc_c++;
        }
    }
    if(gc_c!=0){
        console.log('game over');
        gameContinueFlg=false;
    }
}

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height); //canvas初期化.
    makeStageTmp();
    turn();
    move();
    draw();
    if(gameContinueFlg){
        requestAnimationFrame(main);        
    }
}

selectMino();
main();