(function(){
const TS=16,W=32,H=21;
const ROOF={gray:306,red:418,tan:530,dark:642,blue:754,green:865};
const WALLY={plaster:64,wood:160,stone:224,dark:288};
const BLD=[
 {id:'guild',x:3,y:2,roof:'red',wall:'plaster',panel:'quests'},
 {id:'post',x:12,y:2,roof:'green',wall:'wood',panel:'contact'},
 {id:'armory',x:22,y:2,roof:'dark',wall:'dark',panel:'items'},
 {id:'academy',x:5,y:11,roof:'blue',wall:'stone',panel:'academy'},
 {id:'tavern',x:19,y:11,roof:'tan',wall:'wood',panel:'tavern'}
].map(b=>({...b,w:7,h:7,dx:b.x+3,dy:b.y+6}));
const POND={x:27,y:12,w:3,h:4};
const SPR={round:[277,50,52,60],pine:[404,56,40,52],s1:[277,121,35,50],s2:[320,120,32,48],s3:[355,124,26,46],
 barrel:[193,25,14,18],barrel2:[209,25,14,18],log:[291,22,45,20],stump:[338,25,28,19],stump2:[370,25,28,19],rock:[80,49,16,14],rock2:[98,49,12,14],sign:[53,25,23,20]};
function rng(s){return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646;};}
const path=new Set();const P=(x,y)=>path.add(x+','+y);
for(let x=2;x<=29;x++)P(x,9);for(let x=8;x<=22;x++)P(x,18);for(let y=9;y<=18;y++)P(15,y);
const r=rng(7);const ground=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=path.has(x+','+y);const v=r();
 ground.push(p?[16+Math.floor(r()*4)*16,96]:(v<.08?[16+Math.floor(r()*8)*16,32]:v<.12?[16+Math.floor(r()*8)*16,48]:[32+Math.floor(r()*4)*16,16]));}
const objs=[];const block=new Set();
const add=(k,tx,ty,blk=true,ox=0,oy=0)=>{objs.push({k,bx:tx*TS+8+ox,by:(ty+1)*TS+oy});if(blk&&tx>=0&&ty>=0)block.add(tx+','+ty);};
for(let x=-1;x<=W;x+=2){add(x%4===1?'pine':'round',x,-1,false,Math.round(r()*6-3),6);add(x%4===1?'round':'pine',x+1,0,false,0,4);}
for(let y=1;y<H;y+=2){add(y%4===1?'round':'pine',0,y,false,-4);add(y%4===1?'pine':'round',W-1,y,false,4);}
for(let x=1;x<W-1;x+=2)add(['s1','s2','s3'][x%3],x,H-1,false,Math.round(r()*6-3),10);
[['round',13,13],['pine',17,15],['s2',3,10],['s1',11,10],['pine',28,6],['s3',19,7],['barrel',18,16],['barrel2',18,17],['log',3,16,true,0],['stump',26,18],['rock',28,10],['rock2',2,17],['stump2',9,7],['sign',17,9,true,0,0]].forEach(a=>add(...a));
block.delete('17,9');
function blocked(x,y){if(x<=0||y<=0||x>=W-1||y>=H-1)return true;if(block.has(x+','+y))return true;
 if(x>=POND.x&&x<POND.x+POND.w&&y>=POND.y&&y<POND.y+POND.h)return true;
 const b=BLD.find(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);return !!b&&!(b.dx===x&&b.dy===y);}
function drawHouse(g,im,b){const ox=b.x*TS+2,oy=b.y*TS-2,rx=ROOF[b.roof],wy=WALLY[b.wall];
 g.drawImage(im.house,rx,147,108,82,ox,oy,108,82);
 let x=ox+6;for(const[sx,w]of[[18,12],[160,16],[72,40],[160,16],[50,12]]){g.drawImage(im.house,sx,sx<64?wy:wy,w,32,x,oy+82,w,32);x+=w;}}
function draw(g,im,frame){g.imageSmoothingEnabled=false;
 for(let i=0;i<ground.length;i++){const x=i%W,y=(i/W)|0,[sx,sy]=ground[i];g.drawImage(im.terrain,sx,sy,16,16,x*TS,y*TS,16,16);}
 const f=frame%3;for(let y=0;y<POND.h;y++)for(let x=0;x<POND.w;x++){const cx=x===0?0:x===POND.w-1?2:1,cy=y===0?0:y===POND.h-1?2:1;
  g.drawImage(im.water,(1+3*f+cx)*16,(9+cy)*16,16,16,(POND.x+x)*TS,(POND.y+y)*TS,16,16);}
 const list=[...objs.map(o=>({...o,t:'o'})),...BLD.map(b=>({b,by:(b.y+7)*TS,t:'h'}))].sort((a,b)=>a.by-b.by);
 for(const o of list){if(o.t==='h'){drawHouse(g,im,o.b);continue;}const[sx,sy,sw,sh]=SPR[o.k];g.drawImage(im.outside,sx,sy,sw,sh,Math.round(o.bx-sw/2),o.by-sh,sw,sh);}}
window.PWorld={TS,W,H,BLD,draw,blocked};
})();
