const demoPlayers=[
{id:"1",name:"Alex Morgan",position:"striker",country:"England",club:"Northbridge FC",number:9,honour:"a domestic cup"},
{id:"2",name:"Jamie Carter",position:"midfielder",country:"Scotland",club:"Riverside United",number:8,honour:"a league title"},
{id:"3",name:"Daniel Silva",position:"defender",country:"Portugal",club:"City Athletic",number:4,honour:"a continental trophy"},
{id:"4",name:"Luca Rossi",position:"goalkeeper",country:"Italy",club:"Harbour FC",number:1,honour:"a national cup"}
];
let target=null,revealed=0,score=100;
const clues=p=>[
[`The player primarily plays as a ${p.position}.`,100],
[`The player has represented ${p.country} internationally.`,80],
[`The player currently plays for ${p.club}.`,60],
[`The player has worn shirt number ${p.number}.`,40],
[`The player has won ${p.honour}.`,30]
];
const $=id=>document.getElementById(id);

function start(){
  target=demoPlayers[Math.floor(Math.random()*demoPlayers.length)];
  revealed=0;score=100;
  $("guess").disabled=false;$("guessBtn").disabled=false;$("nextBtn").textContent="↻ New Game";
  $("feedback").textContent="";$("feedback").className="feedback";
  $("guess").value="";showClue();$("guess").focus();
}
function showClue(){
  const c=clues(target)[revealed];
  $("clueNo").textContent=revealed+1;
  $("clue").textContent=c[0];
  $("score").textContent=score+" PTS";
}
function guess(){
  if(!target)return;
  const g=$("guess").value.trim().toLowerCase();
  if(!g)return;
  if(g===target.name.toLowerCase()){
    $("feedback").textContent="🎉 Correct! "+target.name;
    $("feedback").className="feedback good";
    $("guess").disabled=true;$("guessBtn").disabled=true;
    $("clue").textContent="You solved it! Your score: "+score+" points.";
    return;
  }
  revealed++;
  score=clues(target)[revealed]?.[1]??0;
  $("feedback").textContent="Not quite — here's another clue.";
  $("feedback").className="feedback bad";
  if(revealed>=clues(target).length){
    $("clue").textContent="The answer was "+target.name+".";
    $("guess").disabled=true;$("guessBtn").disabled=true;
    return;
  }
  showClue();$("guess").value="";$("guess").focus();
}
$("nextBtn").addEventListener("click",start);
$("guessBtn").addEventListener("click",guess);
$("guess").addEventListener("keydown",e=>{if(e.key==="Enter")guess()});
