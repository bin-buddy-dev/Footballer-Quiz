import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { realPlayers } from './players';

const clues = p => [
  [`The player primarily plays as a ${p.position}.`, 100],
  [`The player represents ${p.country} internationally.`, 80],
  [`The player currently plays for ${p.club}.`, 60],
  [`The player wears squad number ${p.number}.`, 40],
  [`The player has won ${p.honour}.`, 30],
];

const normalise = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').trim().replace(/\s+/g, ' ');

export default function App() {
  const [target, setTarget] = useState(null);
  const [revealed, setRevealed] = useState(0);
  const [score, setScore] = useState(100);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const currentClue = useMemo(() => target ? clues(target)[revealed] : null, [target, revealed]);

  const startGame = () => {
    const next = realPlayers[Math.floor(Math.random() * realPlayers.length)];
    setTarget(next);
    setRevealed(0);
    setScore(100);
    setGuess('');
    setFeedback('');
    setGameOver(false);
  };

  const submitGuess = () => {
    if (!target || gameOver || !guess.trim()) return;
    const accepted = [target.name, ...target.aliases].map(normalise);
    if (accepted.includes(normalise(guess))) {
      setGameOver(true);
      setFeedback(`🎉 Correct! ${target.name}`);
      return;
    }

    const nextIndex = revealed + 1;
    if (nextIndex >= clues(target).length) {
      setGameOver(true);
      setScore(0);
      setFeedback(`The answer was ${target.name}.`);
      return;
    }
    setRevealed(nextIndex);
    setScore(clues(target)[nextIndex][1]);
    setGuess('');
    setFeedback('Not quite — here is another clue.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#063d1d" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.crest}><Text style={styles.crestText}>⚽</Text></View>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>THE ULTIMATE</Text>
              <Text style={styles.title}>FOOTBALLER QUIZ</Text>
            </View>
            <View style={styles.badge}><Text style={styles.badgeText}>🏆 0</Text></View>
          </View>

          <View style={styles.intro}>
            <Text style={styles.question}>Can you identify the player?</Text>
            <Text style={styles.sub}>Reveal clues, make your guess and keep as many points as possible.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.topline}>
              <Text style={styles.toplineText}>CLASSIC MODE</Text>
              <Text style={styles.toplineText}>{score} PTS</Text>
            </View>

            <Text style={styles.clueLabel}>CLUE {target ? revealed + 1 : 1}</Text>
            <Text style={styles.clue}>{currentClue ? currentClue[0] : 'Tap Start Game to reveal your first clue.'}</Text>

            <Text style={[styles.feedback, feedback.startsWith('🎉') ? styles.good : styles.bad]}>{feedback}</Text>

            <TextInput
              value={guess}
              onChangeText={setGuess}
              onSubmitEditing={submitGuess}
              editable={!!target && !gameOver}
              placeholder="Type a player's name…"
              placeholderTextColor="#8fb49a"
              style={styles.input}
              autoCapitalize="words"
              returnKeyType="done"
            />

            <TouchableOpacity style={[styles.button, styles.primary, (!target || gameOver) && styles.disabled]} onPress={submitGuess} disabled={!target || gameOver}>
              <Text style={styles.primaryText}>Guess Player</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.start} onPress={startGame}>
              <Text style={styles.startText}>{target ? '↻ New Game' : '▶ Start Game'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pitch}>
            <View style={styles.pitchHalf} />
            <View style={styles.circle} />
          </View>

          <View style={styles.how}>
            <Text style={styles.howTitle}>HOW IT WORKS</Text>
            <Text style={styles.howText}>Start with 100 points. A wrong guess reveals another clue and lowers the available score.</Text>
          </View>

          <Text style={styles.footer}>Footballer Quiz • Mobile app build</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#063d1d'}, flex:{flex:1},
  container:{padding:20,paddingBottom:40,backgroundColor:'#063d1d',minHeight:'100%'},
  header:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:18},
  crest:{width:54,height:54,borderWidth:3,borderColor:'#b9ff63',borderRadius:27,alignItems:'center',justifyContent:'center',backgroundColor:'#063d1d'},
  crestText:{fontSize:28}, headerText:{flex:1}, eyebrow:{fontSize:10,letterSpacing:2.5,color:'#c8ff89',fontWeight:'900'}, title:{fontSize:21,letterSpacing:1,color:'#fff',fontWeight:'900'},
  badge:{backgroundColor:'#002d14',borderWidth:1,borderColor:'#76a84a',borderRadius:18,paddingVertical:9,paddingHorizontal:11},badgeText:{color:'#fff',fontWeight:'900'},
  intro:{alignItems:'center',paddingVertical:12,paddingHorizontal:8},question:{fontSize:26,fontWeight:'900',color:'#fff',textAlign:'center'},sub:{fontSize:14,lineHeight:21,color:'#d7f3dc',textAlign:'center',marginTop:7},
  card:{borderWidth:2,borderColor:'#76a84a',backgroundColor:'#012d14',borderRadius:26,padding:20,marginTop:4},
  topline:{flexDirection:'row',justifyContent:'space-between'},toplineText:{color:'#bfe7c7',fontSize:11,fontWeight:'900',letterSpacing:1},
  clueLabel:{marginTop:30,color:'#b9ff63',fontSize:12,fontWeight:'900',letterSpacing:1.7},clue:{fontSize:22,lineHeight:30,minHeight:120,color:'#fff',marginTop:10},
  feedback:{minHeight:34,fontWeight:'800',fontSize:14},good:{color:'#c8ff6b'},bad:{color:'#ffb2a8'},
  input:{width:'100%',borderWidth:1,borderColor:'#496d56',backgroundColor:'#052b16',color:'#fff',borderRadius:15,paddingVertical:15,paddingHorizontal:16,marginTop:5,fontSize:16},
  button:{width:'100%',borderRadius:15,paddingVertical:15,alignItems:'center',marginTop:10},primary:{backgroundColor:'#c5ff55'},primaryText:{color:'#063d1d',fontWeight:'900',fontSize:16},disabled:{opacity:0.45},
  start:{backgroundColor:'#0b9f37',borderWidth:2,borderColor:'#c5ff55',borderRadius:15,paddingVertical:15,alignItems:'center',marginTop:10},startText:{color:'#fff',fontWeight:'900',fontSize:18},
  pitch:{height:110,marginTop:18,borderTopWidth:2,borderTopColor:'rgba(255,255,255,.4)',position:'relative',overflow:'hidden'},pitchHalf:{position:'absolute',left:'50%',top:0,bottom:0,width:2,backgroundColor:'rgba(255,255,255,.4)'},circle:{position:'absolute',width:78,height:78,borderWidth:2,borderColor:'rgba(255,255,255,.4)',borderRadius:39,left:'50%',top:27,marginLeft:-39},
  how:{paddingTop:8},howTitle:{fontSize:12,letterSpacing:1.5,color:'#c5ff55',fontWeight:'900'},howText:{marginTop:6,color:'#d9f4de',fontSize:14,lineHeight:21},footer:{textAlign:'center',color:'#8fb49a',fontSize:10,marginTop:20}
});
