import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const ACCENT = '#6C5CE7';

export default function BackendGate({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) { setSession(data.session || null); setReady(true); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next || null));
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  const submit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || password.length < 6) return Alert.alert('Check your details', 'Enter a valid email and a password with at least 6 characters.');
    if (mode === 'register' && (!name.trim() || username.trim().replace(/^@/, '').length < 3)) return Alert.alert('Complete your profile', 'Add your name and a username with at least 3 characters.');
    setLoading(true);
    try {
      if (mode === 'register') {
        const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { name: name.trim(), username: cleanUsername } },
        });
        if (error) throw error;
        if (!data.session) Alert.alert('Verify your email', 'Your LINK account was created. Verify the email, then return here and sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
      }
    } catch (error) {
      Alert.alert(mode === 'register' ? 'Could not create account' : 'Could not sign in', error?.message || 'Try again.');
    } finally { setLoading(false); }
  };

  if (!ready) return <View style={styles.loading}><ActivityIndicator size="large" color={ACCENT} /><Text style={styles.loadingText}>Connecting to LINK…</Text></View>;
  if (session) return children(session);

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView style={styles.center} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.logo}><Ionicons name="link" size={27} color="#fff" /></View>
        <Text style={styles.title}>LINK</Text>
        <Text style={styles.sub}>{mode === 'login' ? 'Sign in to your real LINK account.' : 'Create an account that works across devices.'}</Text>
        <View style={styles.card}>
          {mode === 'register' ? <>
            <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#8C919D" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="@username" placeholderTextColor="#8C919D" autoCapitalize="none" value={username} onChangeText={setUsername} />
          </> : null}
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#8C919D" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#8C919D" secureTextEntry autoCapitalize="none" value={password} onChangeText={setPassword} />
          <Pressable disabled={loading} onPress={submit} style={[styles.primary, loading && { opacity: .6 }]}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{mode === 'login' ? 'Sign in' : 'Create account'}</Text>}
          </Pressable>
          <Pressable onPress={() => setMode(mode === 'login' ? 'register' : 'login')} style={styles.switchBtn}>
            <Text style={styles.switchText}>{mode === 'login' ? 'New to LINK? Create account' : 'Already have LINK? Sign in'}</Text>
          </Pressable>
        </View>
        <Text style={styles.foot}>LINK Production · Supabase backend</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page:{flex:1,backgroundColor:'#F6F7FB'},center:{flex:1,justifyContent:'center',padding:22},logo:{width:58,height:58,borderRadius:20,alignSelf:'center',alignItems:'center',justifyContent:'center',backgroundColor:ACCENT,shadowColor:'#000',shadowOpacity:.12,shadowRadius:20,shadowOffset:{width:0,height:10}},title:{fontSize:38,fontWeight:'950',letterSpacing:-1.4,textAlign:'center',color:'#111318',marginTop:16},sub:{fontSize:15,lineHeight:21,textAlign:'center',color:'#737987',marginTop:5,marginBottom:22},card:{backgroundColor:'#fff',padding:14,borderRadius:28,borderWidth:StyleSheet.hairlineWidth,borderColor:'#E8EAF0',gap:10},input:{height:54,borderRadius:17,backgroundColor:'#F2F3F7',paddingHorizontal:16,fontSize:16,color:'#111318'},primary:{height:54,borderRadius:17,backgroundColor:ACCENT,alignItems:'center',justifyContent:'center',marginTop:3},primaryText:{color:'#fff',fontSize:16,fontWeight:'900'},switchBtn:{height:44,alignItems:'center',justifyContent:'center'},switchText:{color:ACCENT,fontWeight:'800'},foot:{textAlign:'center',fontSize:11,color:'#9AA0AB',marginTop:18},loading:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#F6F7FB'},loadingText:{marginTop:12,color:'#737987',fontWeight:'700'}
});
