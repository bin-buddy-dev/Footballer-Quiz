// Curated real-player prototype pool.
// Players are selected for recognisability and current first-team status in a
// country's top division (or top two divisions). This is intentionally a
// curated pool, not yet the complete licensed global database.
const realPlayers=[
  {id:"haaland",name:"Erling Haaland",aliases:["Haaland"],position:"striker",country:"Norway",club:"Manchester City",number:9,honour:"the Premier League"},
  {id:"foden",name:"Phil Foden",aliases:["Foden"],position:"midfielder",country:"England",club:"Manchester City",number:47,honour:"the Premier League"},
  {id:"saka",name:"Bukayo Saka",aliases:["Saka"],position:"winger",country:"England",club:"Arsenal",number:7,honour:"the Premier League"},
  {id:"rice",name:"Declan Rice",aliases:["Rice"],position:"midfielder",country:"England",club:"Arsenal",number:41,honour:"the Premier League"},
  {id:"palmer",name:"Cole Palmer",aliases:["Palmer"],position:"attacking midfielder",country:"England",club:"Chelsea",number:10,honour:"the UEFA Conference League"},
  {id:"maddison",name:"James Maddison",aliases:["Maddison"],position:"midfielder",country:"England",club:"Tottenham Hotspur",number:10,honour:"the UEFA Conference League"},
  {id:"mbappe",name:"Kylian Mbappe",aliases:["Mbappe","Kylian Mbappe"],position:"forward",country:"France",club:"Real Madrid",number:10,honour:"the FIFA World Cup"},
  {id:"bellingham",name:"Jude Bellingham",aliases:["Bellingham"],position:"midfielder",country:"England",club:"Real Madrid",number:5,honour:"the UEFA Champions League"},
  {id:"vinicius",name:"Vinicius Junior",aliases:["Vinicius","Vini Jr","Vini"],position:"winger",country:"Brazil",club:"Real Madrid",number:7,honour:"the UEFA Champions League"},
  {id:"yamal",name:"Lamine Yamal",aliases:["Yamal"],position:"winger",country:"Spain",club:"Barcelona",number:10,honour:"La Liga"},
  {id:"kane",name:"Harry Kane",aliases:["Kane"],position:"striker",country:"England",club:"Bayern Munich",number:9,honour:"the Bundesliga"},
  {id:"musiala",name:"Jamal Musiala",aliases:["Musiala"],position:"attacking midfielder",country:"Germany",club:"Bayern Munich",number:10,honour:"the Bundesliga"},
  {id:"dembele",name:"Ousmane Dembele",aliases:["Dembele"],position:"forward",country:"France",club:"Paris Saint-Germain",number:10,honour:"the UEFA Champions League"},
  {id:"kvara",name:"Khvicha Kvaratskhelia",aliases:["Kvaratskhelia","Kvara"],position:"winger",country:"Georgia",club:"Paris Saint-Germain",number:7,honour:"the Ligue 1 title"},
  {id:"leao",name:"Rafael Leao",aliases:["Leao"],position:"winger",country:"Portugal",club:"AC Milan",number:10,honour:"Serie A"},
  {id:"pulisic",name:"Christian Pulisic",aliases:["Pulisic"],position:"winger",country:"United States",club:"AC Milan",number:11,honour:"the UEFA Champions League"},
  {id:"lautaro",name:"Lautaro Martinez",aliases:["Lautaro","Martinez"],position:"striker",country:"Argentina",club:"Inter Milan",number:10,honour:"Serie A"},
  {id:"yildiz",name:"Kenan Yildiz",aliases:["Yildiz"],position:"forward",country:"Turkey",club:"Juventus",number:10,honour:"the Coppa Italia"},
  {id:"gyokeres",name:"Viktor Gyokeres",aliases:["Gyokeres"],position:"striker",country:"Sweden",club:"Arsenal",number:14,honour:"the Primeira Liga"},
  {id:"modric",name:"Luka Modric",aliases:["Modric"],position:"midfielder",country:"Croatia",club:"AC Milan",number:14,honour:"the UEFA Champions League"}
];

let target=null,revealed=0,score=100,gameOver=false;
const $=id=>document.getElementById(id);

const clues=p=>[
  [`The player primarily plays as a ${p.position}.`,100],
  [`The player represents ${p.country} internationally.`,80],
  [`The player currently plays for ${p.club}.`,60],
  [`The player wears squad number ${p.number}.`,40],
  [`The player has won ${p.honour}.`,30]
];

function start(){
  target=realPlayers[Math.floor(Math.random()*realPlayers.length)];
  revealed=0;score=100;gameOver=false;
  $("guess").disabled=false;
  $("guessBtn").disabled=false;
  $("nextBtn").textContent="↻ New Game";
  $("feedback").textContent="";
  $("feedback").className="feedback";
  $("guess").value="";
  showClue();
  $("guess").focus();
}

function showClue(){
  const c=clues(target)[revealed];
  $("clueNo").textContent=revealed+1;
  $("clue").textContent=c[0];
  $("score").textContent=score+" PTS";
}

function normalise(value){
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g,"").trim().replace(/\s+/g," ");
}

function guess(){
  if(!target||gameOver)return;
  const g=normalise($("guess").value);
  if(!g)return;

  const accepted=[target.name,...target.aliases].map(normalise);
  if(accepted.includes(g)){
    gameOver=true;
    $("feedback").textContent="🎉 Correct! "+target.name;
    $("feedback").className="feedback good";
    $("guess").disabled=true;
    $("guessBtn").disabled=true;
    $("clue").textContent="You solved it for "+score+" points.";
    return;
  }

  revealed++;
  score=clues(target)[revealed]?.[1]??0;
  $("feedback").textContent="Not quite — here's another clue.";
  $("feedback").className="feedback bad";

  if(revealed>=clues(target).length){
    gameOver=true;
    $("clue").textContent="The answer was "+target.name+".";
    $("guess").disabled=true;
    $("guessBtn").disabled=true;
    $("score").textContent="0 PTS";
    return;
  }

  showClue();
  $("guess").value="";
  $("guess").focus();
}

$("nextBtn").addEventListener("click",start);
$("guessBtn").addEventListener("click",guess);
$("guess").addEventListener("keydown",e=>{if(e.key==="Enter")guess()});
