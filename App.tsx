import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Modal, TextInput,
  TouchableOpacity, Platform, Alert, Linking, Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';

type Screen = 'splash' | 'home' | 'routine' | 'reminders' | 'family' | 'emergency';
interface RoutineTask      { id: string; icon: string; label: string; sub: string; bg: string; }
interface ReminderItem     { id: string; time: string; label: string; audio: string; fallback: string; }
interface FamilyMember     { id: string; name: string; rel: string; imgKey: string; emoji: string; imageUri?: string; }
interface EmergencyContact { id: string; name: string; number: string; type?: 'family' | 'emergency'; }
interface FieldDef         { key: string; label: string; placeholder?: string; keyboard?: any; }

// ─── Boje ─────────────────────────────────────────────────────────────────────
const C = {
  blue: '#4B8BF5', blueLight: '#EFF6FF', teal: '#0EA5E9', tealDark: '#0369A1',
  navy: '#1E3A8A', dark: '#0F172A', text: '#1E293B', sub: '#64748B',
  bg: '#F8FAFC', border: '#E2E8F0', white: '#FFFFFF',
  red: '#EF4444', green: '#10B981', pink: '#F43F5E',
};

// ─── Defaultni podaci ─────────────────────────────────────────────────────────
const DEF_ROUTINE: RoutineTask[] = [
  { id:'1', icon:'🍳', label:'Doručak',             sub:'',               bg:'#FEF9C3' },
  { id:'2', icon:'🍲', label:'Ručak',               sub:'',               bg:'#ECFDF5' },
  { id:'3', icon:'💧', label:'Popij vodu',          sub:'Stoji na stolu', bg:'#EFF6FF' },
  { id:'4', icon:'💊', label:'Uzmi večernji lijek', sub:'Stoji na stolu', bg:'#F5F3FF' },
  { id:'5', icon:'🌙', label:'Vrijeme za spavanje', sub:'',               bg:'#F0F9FF' },
];
const DEF_REMINDERS: ReminderItem[] = [
  { id:'1', time:'12:00', label:'Ručak',              audio:'rucak', fallback:'Ručak u dvanaest sati' },
  { id:'2', time:'15:00', label:'Popij vodu',          audio:'voda',  fallback:'Popij vodu u petnaest sati' },
  { id:'3', time:'20:00', label:'Uzmi večernji lijek', audio:'lijek', fallback:'Uzmi večernji lijek u dvadeset sati' },
];
const DEF_FAMILY: FamilyMember[] = [
  { id:'1', name:'Ana',         rel:'Tvoja ćerka',  imgKey:'ana',   emoji:'👵' },
  { id:'2', name:'Marko',       rel:'Tvoj sin',      imgKey:'marko', emoji:'👨' },
  { id:'3', name:'Lana i Dino', rel:'Tvoji unuci',   imgKey:'lana',  emoji:'👧' },
  { id:'4', name:'Jovan',       rel:'Tvoj brat',     imgKey:'jovan', emoji:'👴' },
];
const DEF_EMERGENCY: EmergencyContact[] = [
  { id:'1', name:'Tata', number:'38269383692', type:'family' },
];

// ─── Storage ──────────────────────────────────────────────────────────────────
const SK = { routine:'dc_routine', reminders:'dc_reminders', family:'dc_family', emergency:'dc_emergency', name:'dc_name', notes:'dc_notes' };
async function loadData<T>(key: string, def: T): Promise<T> {
  try { const v = await AsyncStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function saveData(key: string, val: any) {
  AsyncStorage.setItem(key, JSON.stringify(val)).catch(() => {});
}

// ─── Admin PIN ────────────────────────────────────────────────────────────────
// ↓ Ovdje promijeni PIN koji će kareger koristiti
const ADMIN_PIN = '1234';

// ─── Image picker (web + mobile) ─────────────────────────────────────────────
function pickImageWeb(): Promise<string | null> {
  if (Platform.OS !== 'web') {
    return ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    }).then(result => {
      if (!result.canceled && result.assets?.[0]?.uri) return result.assets[0].uri;
      return null;
    }).catch(() => null);
  }
  return new Promise(resolve => {
    const inp = (document as any).createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new (window as any).FileReader();
      reader.onload = (ev: any) => resolve(ev.target.result as string);
      reader.readAsDataURL(file);
    };
    inp.click();
  });
}

// ─── Audio ────────────────────────────────────────────────────────────────────
// Audio fajlovi nisu dostupni - koristimo TTS (glasovni izgovor)
const AUDIO_FILES: Record<string, any> = {};
// Porodične slike nisu dostupne - koristimo emoji fallback
const PHOTOS: Record<string, any> = {};
// ─── Datum/vrijeme helpers ────────────────────────────────────────────────────
const DANI   = ['Nedjelja','Ponedjeljak','Utorak','Srijeda','Četvrtak','Petak','Subota'];
const MJESECI = ['Januar','Februar','Mart','April','Maj','Juni','Juli','August','Septembar','Oktobar','Novembar','Decembar'];
function fmtTime(d: Date) {
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function fmtDate(d: Date) {
  return `${DANI[d.getDay()]}, ${d.getDate()}. ${MJESECI[d.getMonth()]} ${d.getFullYear()}.`;
}
function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function speakTTS(text: string) {
  if (Platform.OS === 'web') {
    const s = (window as any).speechSynthesis;
    if (!s) return;
    s.cancel();
    const u = new (window as any).SpeechSynthesisUtterance(text);
    u.lang = 'hr-HR'; u.rate = 0.85; s.speak(u);
  } else {
    Speech.stop();
    Speech.speak(text, { language: 'hr-HR', rate: 0.85 });
  }
}
function playAudio(_key: string, fallback: string) {
  speakTTS(fallback);
}
function playAudioTimes(_key: string, fallback: string, times: number) {
  let remaining = times;
  const next = () => {
    if (remaining <= 0) return;
    remaining--;
    if (Platform.OS === 'web') {
      const s = (window as any).speechSynthesis;
      if (!s) return;
      s.cancel();
      const u = new (window as any).SpeechSynthesisUtterance(fallback);
      u.lang = 'hr-HR'; u.rate = 0.85;
      u.onend = next;
      s.speak(u);
    } else {
      Speech.speak(fallback, { language: 'hr-HR', rate: 0.85, onDone: next });
    }
  };
  next();
}
function callNumber(number: string) {
  const clean = number.replace(/[\s+]/g, '');
  Linking.openURL(`https://wa.me/${clean}`).catch(() =>
    Alert.alert('Greška', 'Nije moguće otvoriti WhatsApp.')
  );
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function PhoneWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={pw.outer}>
      <View style={pw.frame}>
        <View style={pw.statusBar}>
          <Text style={pw.time}>9:41</Text>
          <Text style={pw.icons}>▐▐ ▌</Text>
        </View>
        <View style={pw.content}>{children}</View>
        <View style={pw.homeBar}><View style={pw.pill} /></View>
      </View>
    </View>
  );
}
const pw = StyleSheet.create({
  outer: { flex:1, backgroundColor:'#94A3B8', alignItems:'center', justifyContent:'center' },
  frame: {
    width:393, height:852, backgroundColor:C.white, borderRadius:54, overflow:'hidden',
    borderWidth:12, borderColor:C.dark,
    shadowColor:'#000', shadowOffset:{width:0,height:30}, shadowOpacity:0.5, shadowRadius:60, elevation:30,
  },
  statusBar: { height:48, backgroundColor:C.white, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', paddingHorizontal:28, paddingBottom:8 },
  time: { fontSize:15, fontWeight:'700', color:C.dark },
  icons: { fontSize:10, color:C.dark },
  content: { flex:1 },
  homeBar: { height:26, backgroundColor:C.white, alignItems:'center', justifyContent:'center' },
  pill: { width:120, height:5, backgroundColor:C.dark, borderRadius:3 },
});

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const TABS = [
  { label:'Početna',    icon:'🏠', screen:'home'      as Screen },
  { label:'Moj dan',    icon:'📋', screen:'routine'   as Screen },
  { label:'Podsjetnici',icon:'🔔', screen:'reminders' as Screen },
  { label:'Porodica',   icon:'❤️', screen:'family'    as Screen },
];
function BottomNav({ active, onNav }: { active: number; onNav:(s:Screen,i:number)=>void }) {
  return (
    <View style={bn.bar}>
      {TABS.map((t,i) => (
        <TouchableOpacity key={i} style={bn.tab} onPress={() => onNav(t.screen,i)} activeOpacity={0.7}>
          <Text style={bn.icon}>{t.icon}</Text>
          <Text style={[bn.label, i===active && bn.activeLabel]}>{t.label}</Text>
          {i===active && <View style={bn.dot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}
const bn = StyleSheet.create({
  bar: { flexDirection:'row', backgroundColor:C.white, borderTopWidth:1, borderTopColor:C.border, paddingTop:8, paddingBottom:4 },
  tab: { flex:1, alignItems:'center', paddingVertical:2 },
  icon: { fontSize:22 },
  label: { fontSize:10, color:C.sub, marginTop:2, fontWeight:'500' },
  activeLabel: { color:C.blue, fontWeight:'700' },
  dot: { width:4, height:4, borderRadius:2, backgroundColor:C.blue, marginTop:3 },
});

// ─── Shared Header ────────────────────────────────────────────────────────────
function Header({ title, onBack, adminMode, onLockPress }: { title:string; onBack?:()=>void; adminMode?:boolean; onLockPress?:()=>void }) {
  return (
    <View style={hd.row}>
      <TouchableOpacity style={hd.btn} onPress={onBack} activeOpacity={0.7} disabled={!onBack}>
        {onBack && <Text style={hd.back}>‹</Text>}
      </TouchableOpacity>
      <Text style={hd.title}>{title}</Text>
      <TouchableOpacity style={hd.btn} onPress={onLockPress} disabled={!onLockPress}>
        {onLockPress && <Text style={{ fontSize:22 }}>{adminMode ? '🔓' : '🔒'}</Text>}
      </TouchableOpacity>
    </View>
  );
}
const hd = StyleSheet.create({
  row: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingTop:12, paddingBottom:12, backgroundColor:C.white, borderBottomWidth:1, borderBottomColor:C.border },
  btn: { width:44, height:44, alignItems:'center', justifyContent:'center' },
  back: { fontSize:34, color:C.blue, lineHeight:42 },
  title: { fontSize:18, fontWeight:'700', color:C.text },
});

// ─── Admin Modal ──────────────────────────────────────────────────────────────
function AdminModal({ visible, onClose, onSuccess }: { visible:boolean; onClose:()=>void; onSuccess:()=>void }) {
  const [input, setInput] = useState('');

  const verify = () => {
    if (input.trim() === ADMIN_PIN) { setInput(''); onSuccess(); }
    else Alert.alert('Pogrešan PIN', 'Pokušajte ponovo.');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { setInput(''); onClose(); }}>
      <View style={adm.overlay}>
        <View style={adm.box}>
          <Text style={adm.title}>🔐 Admin pristup</Text>
          <Text style={adm.desc}>Unesite PIN kod:</Text>
          <TextInput
            style={[adm.inp, adm.codeInp]}
            value={input}
            onChangeText={setInput}
            keyboardType="numeric"
            maxLength={8}
            secureTextEntry
            autoComplete="off"
            autoCorrect={false}
          />
          <TouchableOpacity style={adm.primaryBtn} onPress={verify}>
            <Text style={adm.primaryBtnText}>Potvrdi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setInput(''); onClose(); }}>
            <Text style={adm.cancel}>Odustani</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const adm = StyleSheet.create({
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center', padding:24 },
  box: { backgroundColor:C.white, borderRadius:20, padding:24, width:'100%' },
  title: { fontSize:20, fontWeight:'800', color:C.text, marginBottom:16, textAlign:'center' },
  desc: { fontSize:14, color:C.sub, marginBottom:10 },
  inp: { borderWidth:1, borderColor:C.border, borderRadius:12, padding:12, fontSize:16, marginBottom:12, color:C.text },
  codeInp: { textAlign:'center', fontSize:24, fontWeight:'800', letterSpacing:6 },
  primaryBtn: { backgroundColor:C.blue, borderRadius:12, paddingVertical:14, alignItems:'center', marginBottom:8 },
  primaryBtnText: { fontSize:16, fontWeight:'700', color:C.white },
  link: { color:C.blue, textAlign:'center', marginBottom:12, fontSize:14 },
  cancel: { color:C.sub, textAlign:'center', fontSize:14, paddingVertical:8 },
});

// ─── Add Item Modal ───────────────────────────────────────────────────────────
function AddItemModal({ visible, title, fields, onClose, onSave, defaultValues, saveLabel }: {
  visible:boolean; title:string; fields:FieldDef[]; onClose:()=>void;
  onSave:(v:Record<string,string>)=>void; defaultValues?:Record<string,string>; saveLabel?:string;
}) {
  const [vals, setVals] = useState<Record<string,string>>({});
  useEffect(() => { if (visible) setVals(defaultValues || {}); }, [visible]);
  const handleSave = () => {
    for (const f of fields) {
      if (!vals[f.key]?.trim()) { Alert.alert('Greška', `Popunite: ${f.label}`); return; }
    }
    onSave(vals); setVals({}); onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { setVals({}); onClose(); }}>
      <View style={aim.overlay}>
        <View style={aim.box}>
          <Text style={aim.title}>{title}</Text>
          {fields.map(f => (
            <TextInput key={f.key} style={aim.inp} placeholder={f.placeholder||f.label}
              value={vals[f.key]||''} onChangeText={v => setVals(p=>({...p,[f.key]:v}))}
              keyboardType={f.keyboard||'default'} />
          ))}
          <TouchableOpacity style={aim.saveBtn} onPress={handleSave}>
            <Text style={aim.saveBtnText}>{saveLabel || '+ Dodaj'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setVals({}); onClose(); }}><Text style={aim.cancel}>Odustani</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const aim = StyleSheet.create({
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'flex-end' },
  box: { backgroundColor:C.white, borderTopLeftRadius:24, borderTopRightRadius:24, padding:24 },
  title: { fontSize:18, fontWeight:'800', color:C.text, marginBottom:16 },
  inp: { borderWidth:1, borderColor:C.border, borderRadius:12, padding:12, fontSize:15, marginBottom:10, color:C.text },
  saveBtn: { backgroundColor:C.blue, borderRadius:12, paddingVertical:14, alignItems:'center', marginBottom:8 },
  saveBtnText: { fontSize:16, fontWeight:'700', color:C.white },
  cancel: { color:C.sub, textAlign:'center', fontSize:14, paddingVertical:8 },
});

// ─── Add Family Modal (s foto pickerom) ───────────────────────────────────────
function AddFamilyModal({ visible, onClose, onSave }: {
  visible:boolean; onClose:()=>void; onSave:(name:string, rel:string, imageUri:string|null)=>void;
}) {
  const [name, setName] = useState('');
  const [rel,  setRel]  = useState('');
  const [uri,  setUri]  = useState<string|null>(null);

  const pickPhoto = async () => {
    const result = await pickImageWeb();
    if (result) setUri(result);
  };
  const handleSave = () => {
    if (!name.trim()) { Alert.alert('Greška', 'Unesite ime.'); return; }
    if (!rel.trim())  { Alert.alert('Greška', 'Unesite odnos.'); return; }
    onSave(name, rel, uri);
    setName(''); setRel(''); setUri(null); onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { setName(''); setRel(''); setUri(null); onClose(); }}>
      <View style={aim.overlay}>
        <View style={aim.box}>
          <Text style={aim.title}>Dodaj člana porodice</Text>
          <TouchableOpacity style={afm.photoPicker} onPress={pickPhoto} activeOpacity={0.8}>
            {uri ? (
              <Image source={{ uri }} style={afm.photoPreview} />
            ) : (
              <View style={afm.photoPlaceholder}>
                <Text style={{ fontSize:36 }}>📷</Text>
                <Text style={afm.photoHint}>Dodaj sliku</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput style={aim.inp} placeholder="Ime (npr. Sestra)" value={name} onChangeText={setName} />
          <TextInput style={aim.inp} placeholder="Odnos (npr. Tvoja sestra)" value={rel}  onChangeText={setRel}  />
          <TouchableOpacity style={aim.saveBtn} onPress={handleSave}>
            <Text style={aim.saveBtnText}>+ Dodaj</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setName(''); setRel(''); setUri(null); onClose(); }}>
            <Text style={aim.cancel}>Odustani</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const afm = StyleSheet.create({
  photoPicker: { alignSelf:'center', marginBottom:16 },
  photoPreview: { width:100, height:100, borderRadius:50 },
  photoPlaceholder: { width:100, height:100, borderRadius:50, backgroundColor:'#EFF6FF', alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:C.blue, borderStyle:'dashed' },
  photoHint: { fontSize:11, color:C.blue, marginTop:4, fontWeight:'600' },
});

// Shared add/delete button styles
const shared = StyleSheet.create({
  addBtn: { backgroundColor:C.blueLight, borderRadius:14, padding:14, alignItems:'center', marginTop:8, marginBottom:4, borderWidth:1.5, borderColor:C.blue, borderStyle:'dashed' },
  addBtnText: { color:C.blue, fontWeight:'700', fontSize:15 },
  deleteBtn: { width:28, height:28, borderRadius:14, backgroundColor:C.red, alignItems:'center', justifyContent:'center', marginRight:8 },
  deleteBtnText: { color:C.white, fontWeight:'800', fontSize:13 },
});

// ─── Splash ───────────────────────────────────────────────────────────────────
function SplashScreen({ onGo }: { onGo:()=>void }) {
  return (
    <View style={sp.root}>
      <View style={sp.body}>
        <View style={sp.logo}><Text style={{ fontSize:56 }}>🧠</Text></View>
        <Text style={sp.title}>Dementia-Friendly{'\n'}Daily Companion</Text>
        <Text style={sp.sub}>Vaš digitalni pomoćnik za{'\n'}svakodnevni život.</Text>
      </View>
      <TouchableOpacity style={sp.btn} onPress={onGo} activeOpacity={0.85}>
        <Text style={sp.btnText}>Zapocnite  ›</Text>
      </TouchableOpacity>
    </View>
  );
}
const sp = StyleSheet.create({
  root: { flex:1, backgroundColor:C.white, alignItems:'center', justifyContent:'space-between', paddingHorizontal:32, paddingTop:48, paddingBottom:44 },
  body: { flex:1, alignItems:'center', justifyContent:'center' },
  logo: { width:120, height:120, borderRadius:60, backgroundColor:'#EFF6FF', alignItems:'center', justifyContent:'center', marginBottom:32 },
  title: { fontSize:27, fontWeight:'800', color:C.text, textAlign:'center', lineHeight:36, marginBottom:16 },
  sub: { fontSize:15, color:C.sub, textAlign:'center', lineHeight:22 },
  btn: { backgroundColor:C.blue, borderRadius:14, paddingVertical:17, width:'100%', alignItems:'center' },
  btnText: { fontSize:17, fontWeight:'700', color:C.white },
});

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeScreen({ navigate, userName, adminMode, onAdminPress, onNameChange, notes, onNotesChange, firstContact, onEditFirstContact }: {
  navigate:(s:Screen)=>void; userName:string; adminMode:boolean; onAdminPress:()=>void; onNameChange:(n:string)=>void;
  notes:string; onNotesChange:(n:string)=>void; firstContact:EmergencyContact|null; onEditFirstContact:(name:string,number:string)=>void;
}) {
  const now = useNow();
  const [editingName,    setEditingName]    = useState(false);
  const [editingNotes,   setEditingNotes]   = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [draftName,      setDraftName]      = useState('');
  const [draftNotes,     setDraftNotes]     = useState('');
  const rows = [
    { icon:'🏡', bg:'#EEF2FF', label:'Moj dan',      sub:'Dnevne aktivnosti', go:'routine'   as Screen },
    { icon:'🔔', bg:'#F0FDF4', label:'Podsjetnici',   sub:'Danas 3',           go:'reminders' as Screen },
    { icon:'👨‍👩‍👧', bg:'#FFF1F2', label:'Porodica',    sub:'4 osobe',           go:'family'    as Screen },
    { icon:'🆘', bg:'#FEE2E2', label:'Brza pomoć',   sub:'Pozovi odmah',      go:'emergency' as Screen },
  ];
  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }} contentContainerStyle={hs.scroll} showsVerticalScrollIndicator={false}>
      {/* Greeting + admin lock */}
      <View style={hs.greetRow}>
        <View style={{ flex:1 }}>
          <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
            <Text style={hs.hi}>Zdravo {userName},</Text>
            {adminMode && (
              <TouchableOpacity onPress={() => { setDraftName(userName); setEditingName(true); }}>
                <Text style={{ fontSize:18 }}>✏️</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={hs.hiSub}>Vaš digitalni pomoćnik za svakodnevni život.</Text>
        </View>
        <TouchableOpacity onPress={onAdminPress} style={{ padding:8 }}>
          <Text style={{ fontSize:22 }}>{adminMode ? '🔓' : '🔒'}</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency call — uvijek prvo */}
      {firstContact && (
        <View style={{ position:'relative' }}>
          <TouchableOpacity style={hs.emergencyBtn} activeOpacity={0.85} onPress={() => callNumber(firstContact.number)}>
            <Text style={{ fontSize:28 }}>📞</Text>
            <Text style={hs.emergencyLabel}>Pozovi {firstContact.name}</Text>
          </TouchableOpacity>
          {adminMode && (
            <TouchableOpacity style={hs.emergencyEdit} onPress={() => setEditingContact(true)}>
              <Text style={{ fontSize:13 }}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <AddEmergencyModal
        visible={editingContact} saveLabel="Spremi"
        defaultValues={firstContact ? { name:firstContact.name, number:firstContact.number } : undefined}
        onClose={() => setEditingContact(false)}
        onSave={(name, number) => { onEditFirstContact(name, number); setEditingContact(false); }}
      />

      {/* Notes box */}
      <View style={hs.notesCard}>
        <View style={hs.notesHeader}>
          <Text style={hs.notesTitle}>📋 Važne napomene</Text>
          {adminMode && (
            <TouchableOpacity onPress={() => { setDraftNotes(notes); setEditingNotes(true); }}>
              <Text style={{ fontSize:16 }}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={hs.notesText}>{notes || 'Nema napomena. Admin može dodati važne informacije.'}</Text>
      </View>

      <TouchableOpacity style={hs.timeCard} activeOpacity={0.85}>
        <View>
          <Text style={hs.timeNum}>{fmtTime(now)}</Text>
          <Text style={hs.timeDate}>{fmtDate(now)}</Text>
        </View>
        <Text style={hs.arrow}>›</Text>
      </TouchableOpacity>
      <View style={hs.sleepCard}>
        <Text style={{ fontSize:36 }}>{
          now.getHours() >= 6 && now.getHours() < 12 ? '☀️' :
          now.getHours() >= 12 && now.getHours() < 18 ? '🌤️' :
          now.getHours() >= 18 && now.getHours() < 22 ? '🌆' : '🌙'
        }</Text>
        <View>
          <Text style={hs.sleepTitle}>{
            now.getHours() >= 6 && now.getHours() < 12 ? `Dobro jutro, ${userName}` :
            now.getHours() >= 12 && now.getHours() < 18 ? `Dobar dan, ${userName}` :
            now.getHours() >= 18 && now.getHours() < 22 ? `Dobro veče, ${userName}` :
            `Laku noć, ${userName}`
          }</Text>
          <Text style={hs.sleepSub}>{
            now.getHours() >= 6 && now.getHours() < 12 ? 'Lijep dan pred vama!' :
            now.getHours() >= 12 && now.getHours() < 18 ? 'Nadam se da ste dobro.' :
            now.getHours() >= 18 && now.getHours() < 22 ? 'Prijatno veče!' :
            'Vrijeme je za odmor.'
          }</Text>
        </View>
      </View>
      <View style={hs.menu}>
        {rows.map((r,i) => (
          <React.Fragment key={i}>
            <TouchableOpacity style={hs.row} onPress={() => navigate(r.go)} activeOpacity={0.7}>
              <View style={[hs.rowIcon, { backgroundColor:r.bg }]}><Text style={{ fontSize:22 }}>{r.icon}</Text></View>
              <View style={{ flex:1 }}>
                <Text style={hs.rowLabel}>{r.label}</Text>
                <Text style={hs.rowSub}>{r.sub}</Text>
              </View>
              <Text style={hs.rowArrow}>›</Text>
            </TouchableOpacity>
            {i < rows.length-1 && <View style={hs.divider} />}
          </React.Fragment>
        ))}
      </View>

      {/* Edit name modal */}
      <Modal visible={editingName} transparent animationType="fade" onRequestClose={() => setEditingName(false)}>
        <View style={adm.overlay}>
          <View style={adm.box}>
            <Text style={adm.title}>✏️ Promijeni ime</Text>
            <TextInput style={adm.inp} value={draftName} onChangeText={setDraftName} placeholder="Unesite ime" autoFocus />
            <TouchableOpacity style={adm.primaryBtn} onPress={() => {
              if (draftName.trim()) { onNameChange(draftName.trim()); setEditingName(false); }
            }}>
              <Text style={adm.primaryBtnText}>Spremi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingName(false)}><Text style={adm.cancel}>Odustani</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit notes modal */}
      <Modal visible={editingNotes} transparent animationType="fade" onRequestClose={() => setEditingNotes(false)}>
        <View style={adm.overlay}>
          <View style={adm.box}>
            <Text style={adm.title}>📋 Uredi napomene</Text>
            <TextInput
              style={[adm.inp, { height:140, textAlignVertical:'top' }]}
              value={draftNotes}
              onChangeText={setDraftNotes}
              placeholder={'npr. Ključ od kuće je na polici pored vrata.\nNoćni ormarić je desno od kreveta.\nPritisni crveno dugme ako trebaš pomoć.'}
              multiline
              numberOfLines={6}
              autoFocus
            />
            <TouchableOpacity style={adm.primaryBtn} onPress={() => { onNotesChange(draftNotes); setEditingNotes(false); }}>
              <Text style={adm.primaryBtnText}>Spremi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingNotes(false)}><Text style={adm.cancel}>Odustani</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const hs = StyleSheet.create({
  scroll: { padding:20, paddingBottom:12 },
  greetRow: { flexDirection:'row', alignItems:'flex-start', marginBottom:16 },
  greet: { marginBottom:20 },
  hi: { fontSize:38, fontWeight:'800', color:C.text },
  hiSub: { fontSize:13, color:C.sub, marginTop:4, lineHeight:19 },
  emergencyBtn: { backgroundColor:C.red, borderRadius:18, paddingVertical:18, paddingHorizontal:24, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:12, marginBottom:14, shadowColor:C.red, shadowOffset:{width:0,height:6}, shadowOpacity:0.4, shadowRadius:12, elevation:8 },
  emergencyLabel: { fontSize:20, fontWeight:'800', color:C.white },
  emergencyEdit: { position:'absolute', top:8, right:8, width:30, height:30, borderRadius:15, backgroundColor:'rgba(255,255,255,0.25)', alignItems:'center', justifyContent:'center' },
  notesCard: { backgroundColor:C.white, borderRadius:18, padding:18, marginBottom:14, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:8, elevation:2 },
  notesHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  notesTitle: { fontSize:15, fontWeight:'700', color:C.text },
  notesText: { fontSize:14, color:C.sub, lineHeight:22 },
  timeCard: { backgroundColor:C.white, borderRadius:18, padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:8, elevation:2 },
  timeNum: { fontSize:46, fontWeight:'800', color:C.text },
  timeDate: { fontSize:13, color:C.sub, marginTop:2 },
  arrow: { fontSize:30, color:'#CBD5E1' },
  sleepCard: { backgroundColor:C.navy, borderRadius:18, padding:20, flexDirection:'row', alignItems:'center', gap:14, marginBottom:20 },
  sleepTitle: { fontSize:18, fontWeight:'800', color:C.white },
  sleepSub: { fontSize:13, color:'#93C5FD', marginTop:2 },
  menu: { backgroundColor:C.white, borderRadius:18, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:8, elevation:2 },
  row: { flexDirection:'row', alignItems:'center', padding:16, gap:14 },
  rowIcon: { width:46, height:46, borderRadius:12, alignItems:'center', justifyContent:'center' },
  rowLabel: { fontSize:16, fontWeight:'600', color:C.text },
  rowSub: { fontSize:12, color:C.sub, marginTop:2 },
  rowArrow: { fontSize:22, color:'#CBD5E1' },
  divider: { height:1, backgroundColor:C.border, marginLeft:76 },
});

// ─── Routine ──────────────────────────────────────────────────────────────────
function RoutineScreen({ onBack, items, onChange, adminMode, onAdminPress }: {
  onBack:()=>void; items:RoutineTask[]; onChange:(v:RoutineTask[])=>void; adminMode:boolean; onAdminPress:()=>void;
}) {
  const now = useNow();
  const [done, setDone] = useState<Record<string,boolean>>({});
  const [showAdd, setShowAdd] = useState(false);
  const toggle = (id:string) => setDone(d => ({ ...d, [id]:!d[id] }));
  const remove = (id:string) => onChange(items.filter(i => i.id !== id));
  const add = (vals:Record<string,string>) => onChange([...items, { id:Date.now().toString(), icon:'📌', label:vals.label, sub:vals.sub||'', bg:'#F3F4F6' }]);
  const move = (idx:number, dir:-1|1) => {
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    onChange(arr);
  };

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <Header title="Moj dan" onBack={onBack} adminMode={adminMode} onLockPress={onAdminPress} />
      <View style={rt.card}>
        <Text style={{ fontSize:30 }}>🕙</Text>
        <View>
          <Text style={rt.cardTime}>{fmtTime(now)}</Text>
        </View>
      </View>-
      <ScrollView contentContainerStyle={rt.list}>
        {items.map((item, idx) => (
          <View key={item.id} style={rt.row}>
            {adminMode && (
              <View style={rt.adminCol}>
                <TouchableOpacity style={rt.arrowBtn} onPress={() => move(idx, -1)} disabled={idx===0}>
                  <Text style={[rt.arrowText, idx===0 && { opacity:0.2 }]}>▲</Text>
                </TouchableOpacity>
                <TouchableOpacity style={rt.arrowBtn} onPress={() => move(idx, 1)} disabled={idx===items.length-1}>
                  <Text style={[rt.arrowText, idx===items.length-1 && { opacity:0.2 }]}>▼</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={[rt.item, { flex:1 }]} onPress={() => toggle(item.id)} activeOpacity={0.75}>
              <View style={[rt.icon, { backgroundColor:item.bg }]}><Text style={{ fontSize:22 }}>{item.icon}</Text></View>
              <View style={{ flex:1 }}>
                <Text style={rt.label}>{item.label}</Text>
                {!!item.sub && <Text style={rt.sub}>{item.sub}</Text>}
              </View>
              <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                {adminMode && (
                  <TouchableOpacity style={shared.deleteBtn} onPress={() => remove(item.id)}>
                    <Text style={shared.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
                <View style={[rt.check, done[item.id] && rt.checkDone]}>
                  {done[item.id] && <Text style={rt.tick}>✓</Text>}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {adminMode && (
          <TouchableOpacity style={shared.addBtn} onPress={() => setShowAdd(true)}>
            <Text style={shared.addBtnText}>+ Dodaj stavku</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <AddItemModal visible={showAdd} title="Dodaj stavku u toku dana"
        fields={[
          { key:'label', label:'Naziv',               placeholder:'npr. Šetnja' },
          { key:'sub',   label:'Napomena (opcionalno)',placeholder:'npr. U 16:00' },
        ]}
        onClose={() => setShowAdd(false)} onSave={add} />
    </View>
  );
}
const rt = StyleSheet.create({
  card: { margin:16, backgroundColor:C.blue, borderRadius:16, padding:18, flexDirection:'row', alignItems:'center', gap:14 },
  cardTime: { fontSize:26, fontWeight:'800', color:C.white },
  cardSub: { fontSize:13, color:'rgba(255,255,255,0.75)', marginTop:2 },
  list: { paddingHorizontal:16, paddingBottom:16 },
  row: { flexDirection:'row', alignItems:'center', marginBottom:10, gap:8 },
  item: { flexDirection:'row', alignItems:'center', backgroundColor:C.white, borderRadius:14, padding:14, gap:12, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:4, elevation:1 },
  icon: { width:44, height:44, borderRadius:12, alignItems:'center', justifyContent:'center' },
  label: { fontSize:15, fontWeight:'600', color:C.text },
  sub: { fontSize:12, color:C.sub, marginTop:1 },
  check: { width:26, height:26, borderRadius:13, borderWidth:2, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  checkDone: { backgroundColor:C.green, borderColor:C.green },
  tick: { color:C.white, fontSize:14, fontWeight:'800' },
  adminCol: { justifyContent:'center', gap:2, marginRight:4 },
  arrowBtn: { width:26, height:26, borderRadius:8, backgroundColor:C.blueLight, alignItems:'center', justifyContent:'center' },
  arrowText: { fontSize:11, color:C.blue, fontWeight:'800' },
});

// ─── Reminders ────────────────────────────────────────────────────────────────
function RemindersScreen({ onBack, items, onChange, adminMode, onAdminPress }: {
  onBack:()=>void; items:ReminderItem[]; onChange:(v:ReminderItem[])=>void; adminMode:boolean; onAdminPress:()=>void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const now = useNow();
  const [notifPerm, setNotifPerm] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const remove = (id:string) => onChange(items.filter(i => i.id !== id));
  const add = (vals:Record<string,string>) => onChange([...items, { id:Date.now().toString(), time:vals.time, label:vals.label, audio:'', fallback:`${vals.label} u ${vals.time}` }]);
  const requestNotif = async () => {
    if (typeof Notification === 'undefined') return;
    const p = await Notification.requestPermission();
    setNotifPerm(p);
  };

  const toMin = (t:string) => { const [h,m] = t.split(':').map(Number); return h*60+m; };
  const curMin = now.getHours()*60 + now.getMinutes();
  const sorted = [...items].sort((a,b) => toMin(a.time) - toMin(b.time));
  const nextReminder = sorted.find(r => toMin(r.time) > curMin) ?? sorted[0];

  const ReminderCard = ({ r, showDelete }: { r:ReminderItem; showDelete:boolean }) => (
    <View style={re.row}>
      {showDelete && (
        <TouchableOpacity style={shared.deleteBtn} onPress={() => remove(r.id)}>
          <Text style={shared.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      )}
      <View style={[re.card, { flex:1 }]}>
        <View style={re.top}>
          <Text style={{ fontSize:20 }}>🕐</Text>
          <Text style={re.time}>{r.time}</Text>
          <Text style={re.rLabel}>{r.label}</Text>
        </View>
        <TouchableOpacity style={re.btn} activeOpacity={0.8} onPress={() => playAudio(r.audio, r.fallback)}>
          <Text style={{ fontSize:18 }}>🔊</Text>
          <Text style={re.btnText}>Slušaj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <Header title="Podsjetnici" onBack={onBack} adminMode={adminMode} onLockPress={onAdminPress} />
      {notifPerm !== 'granted' && (
        <TouchableOpacity style={re.notifBanner} onPress={requestNotif} activeOpacity={0.8}>
          <Text style={{ fontSize:20 }}>🔔</Text>
          <Text style={re.notifBannerText}>Dozvoli notifikacije da te podsjetimo na vrijeme</Text>
        </TouchableOpacity>
      )}
      <View style={re.info}>
        <Text style={{ fontSize:24 }}>{notifPerm === 'granted' ? '✅' : '🔔'}</Text>
        <Text style={re.infoText}>{notifPerm === 'granted' ? 'Notifikacije su aktivne' : 'Pritisni dugme za zvučni podsjetnik'}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding:16 }}>
        {adminMode ? (
          <>
            {sorted.map(r => <ReminderCard key={r.id} r={r} showDelete />)}
            <TouchableOpacity style={shared.addBtn} onPress={() => setShowAdd(true)}>
              <Text style={shared.addBtnText}>+ Dodaj podsjetnik</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {nextReminder ? (
              <>
                <Text style={re.nextLabel}>Sljedeći podsjetnik</Text>
                <ReminderCard r={nextReminder} showDelete={false} />
              </>
            ) : (
              <Text style={re.emptyText}>Nema podsjetnika.</Text>
            )}
          </>
        )}
      </ScrollView>
      <AddItemModal visible={showAdd} title="Dodaj podsjetnik"
        fields={[
          { key:'time',  label:'Vrijeme', placeholder:'npr. 14:30' },
          { key:'label', label:'Naziv',   placeholder:'npr. Uzmi lijek' },
        ]}
        onClose={() => setShowAdd(false)} onSave={add} />
    </View>
  );
}
const re = StyleSheet.create({
  notifBanner: { marginHorizontal:16, marginTop:12, backgroundColor:'#FEF3C7', borderRadius:12, padding:14, flexDirection:'row', alignItems:'center', gap:10, borderWidth:1, borderColor:'#FCD34D' },
  notifBannerText: { flex:1, fontSize:13, color:'#92400E', fontWeight:'600', lineHeight:18 },
  info: { margin:16, backgroundColor:'#EFF6FF', borderRadius:14, padding:16, flexDirection:'row', alignItems:'center', gap:12 },
  infoText: { fontSize:14, color:C.tealDark, fontWeight:'500', lineHeight:20, flex:1 },
  row: { flexDirection:'row', alignItems:'center', marginBottom:12, gap:8 },
  card: { backgroundColor:C.white, borderRadius:16, padding:16, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:6, elevation:1 },
  top: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:14 },
  time: { fontSize:22, fontWeight:'800', color:C.text },
  rLabel: { fontSize:13, color:C.sub, fontWeight:'500' },
  btn: { backgroundColor:C.teal, borderRadius:12, paddingVertical:12, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:8 },
  btnText: { fontSize:15, fontWeight:'700', color:C.white },
  nextLabel: { fontSize:13, color:C.sub, fontWeight:'600', marginBottom:10, textTransform:'uppercase', letterSpacing:1 },
  emptyText: { fontSize:15, color:C.sub, textAlign:'center', marginTop:40 },
});

// ─── Family ───────────────────────────────────────────────────────────────────
function FamilyScreen({ members, onChange, adminMode, onAdminPress }: {
  onBack:()=>void; members:FamilyMember[]; onChange:(v:FamilyMember[])=>void; adminMode:boolean; onAdminPress:()=>void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const remove = (id:string) => onChange(members.filter(m => m.id !== id));
  const add = (name:string, rel:string, imageUri:string|null) =>
    onChange([...members, { id:Date.now().toString(), name, rel, imgKey:'', emoji:'👤', imageUri: imageUri||undefined }]);

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <View style={fa.header}>
        <View style={{ flex:1 }}>
          <Text style={fa.title}>Porodica</Text>
          <View style={fa.sub}>
            <Text style={{ fontSize:18, color:C.pink }}>♡</Text>
            <Text style={fa.subText}>Ovo su ljudi koji te vole</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onAdminPress} style={{ padding:8 }}>
          <Text style={{ fontSize:22 }}>{adminMode ? '🔓' : '🔒'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={fa.grid}>
        {members.map(p => (
          <View key={p.id} style={fa.cardWrap}>
            <TouchableOpacity style={fa.card} activeOpacity={0.85}>
              {p.imageUri ? (
                <Image source={{ uri: p.imageUri }} style={fa.photo} />
              ) : PHOTOS[p.imgKey] ? (
                <Image source={PHOTOS[p.imgKey]} style={fa.photo} />
              ) : (
                <View style={fa.avatar}><Text style={{ fontSize:44 }}>{p.emoji}</Text></View>
              )}
              <Text style={fa.name}>{p.name}</Text>
              <Text style={fa.rel}>{p.rel}</Text>
            </TouchableOpacity>
            {adminMode && (
              <TouchableOpacity style={fa.deleteBtn} onPress={() => remove(p.id)}>
                <Text style={{ color:C.white, fontSize:12, fontWeight:'800' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {adminMode && (
          <TouchableOpacity style={[shared.addBtn, { width:'100%' }]} onPress={() => setShowAdd(true)}>
            <Text style={shared.addBtnText}>+ Dodaj člana porodice</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <AddFamilyModal visible={showAdd} onClose={() => setShowAdd(false)} onSave={add} />
    </View>
  );
}
const fa = StyleSheet.create({
  header: { backgroundColor:C.white, paddingHorizontal:20, paddingTop:20, paddingBottom:16, borderBottomWidth:1, borderBottomColor:C.border, flexDirection:'row', alignItems:'center' },
  title: { fontSize:30, fontWeight:'800', color:C.text },
  sub: { flexDirection:'row', alignItems:'center', gap:6, marginTop:6 },
  subText: { fontSize:14, color:C.sub },
  grid: { flexDirection:'row', flexWrap:'wrap', padding:16, justifyContent:'space-between' },
  cardWrap: { width:'48%', marginBottom:12, position:'relative' },
  card: { backgroundColor:C.white, borderRadius:18, padding:18, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8, elevation:2 },
  avatar: { width:110, height:110, borderRadius:55, backgroundColor:'#EFF6FF', alignItems:'center', justifyContent:'center', marginBottom:12 },
  photo: { width:110, height:110, borderRadius:55, marginBottom:12 },
  name: { fontSize:16, fontWeight:'700', color:C.text },
  rel: { fontSize:12, color:C.sub, marginTop:3, textAlign:'center' },
  deleteBtn: { position:'absolute', top:-6, right:-6, width:26, height:26, borderRadius:13, backgroundColor:C.red, alignItems:'center', justifyContent:'center', zIndex:10 },
});

// ─── Add Emergency Modal ──────────────────────────────────────────────────────
function AddEmergencyModal({ visible, onClose, onSave, defaultValues, saveLabel }: {
  visible:boolean; onClose:()=>void; saveLabel?:string;
  onSave:(name:string, number:string)=>void;
  defaultValues?: { name:string; number:string };
}) {
  const [name,   setName]   = useState('');
  const [number, setNumber] = useState('');
  useEffect(() => {
    if (visible) { setName(defaultValues?.name || ''); setNumber(defaultValues?.number || ''); }
  }, [visible]);
  const handleSave = () => {
    if (!name.trim())   { Alert.alert('Greška', 'Unesite naziv.'); return; }
    if (!number.trim()) { Alert.alert('Greška', 'Unesite broj.'); return; }
    onSave(name.trim(), number.replace(/[\s+]/g,''));
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={aim.overlay}>
        <View style={aim.box}>
          <Text style={aim.title}>{saveLabel ? 'Uredi kontakt' : 'Dodaj kontakt'}</Text>
          <TextInput style={aim.inp} placeholder="Naziv (npr. sina, ćerku)" value={name} onChangeText={setName} />
          <TextInput style={aim.inp} placeholder="+38761123456" value={number} onChangeText={setNumber} keyboardType="phone-pad" />
          <TouchableOpacity style={aim.saveBtn} onPress={handleSave}>
            <Text style={aim.saveBtnText}>{saveLabel || '+ Dodaj'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}><Text style={aim.cancel}>Odustani</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
// ─── Emergency ────────────────────────────────────────────────────────────────
function EmergencyScreen({ onBack, contacts, onChange, adminMode, onAdminPress }: {
  onBack:()=>void; contacts:EmergencyContact[]; onChange:(v:EmergencyContact[])=>void; adminMode:boolean; onAdminPress:()=>void;
}) {
  const [showAdd,  setShowAdd]  = useState(false);
  const [editItem, setEditItem] = useState<EmergencyContact|null>(null);

  const remove = (id:string) => onChange(contacts.filter(c => c.id !== id));
  const add  = (name:string, number:string) =>
    onChange([...contacts, { id:Date.now().toString(), name, number, type:'family' }]);
  const save = (name:string, number:string) =>
    onChange(contacts.map(c => c.id===editItem?.id ? { ...c, name, number } : c));

  return (
    <View style={{ flex:1, backgroundColor:C.white }}>
      <Header title="" onBack={onBack} adminMode={adminMode} onLockPress={onAdminPress} />
      <ScrollView contentContainerStyle={em.body}>
        <View style={em.badge}><Text style={em.bang}>!</Text></View>
        <Text style={em.title}>Brza pomoć</Text>
        <Text style={em.sectionDesc}>
          {'Za poziv pritisni '}
          <Text style={{ color:C.green, fontWeight:'800' }}>zeleno dugme</Text>
        </Text>

        {contacts.map(c => (
          <View key={c.id} style={em.contactWrap}>
            <TouchableOpacity style={em.callBtn} activeOpacity={0.85} onPress={() => callNumber(c.number)}>
              <View style={[em.circle, { backgroundColor:C.green, shadowColor:C.green }]}>
                <Text style={{ fontSize:42 }}>📞</Text>
              </View>
              <Text style={[em.callLabel, { color:C.green }]}>Pozovi {c.name}</Text>
            </TouchableOpacity>
            {adminMode && (
              <View style={em.adminBtns}>
                <TouchableOpacity style={em.editBtn} onPress={() => setEditItem(c)}>
                  <Text style={{ fontSize:13 }}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={em.deleteBtn} onPress={() => remove(c.id)}>
                  <Text style={{ color:C.white, fontSize:12, fontWeight:'800' }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {adminMode && (
          <TouchableOpacity style={[shared.addBtn, { width:'100%', marginTop:16 }]} onPress={() => setShowAdd(true)}>
            <Text style={shared.addBtnText}>+ Dodaj kontakt</Text>
          </TouchableOpacity>
        )}
        <Text style={em.note}>Tvoja pomoć je uvijek dostupna.</Text>
      </ScrollView>

      <AddEmergencyModal visible={showAdd} onClose={() => setShowAdd(false)} onSave={add} />
      <AddEmergencyModal
        visible={!!editItem} saveLabel="Spremi"
        defaultValues={editItem ? { name:editItem.name, number:editItem.number } : undefined}
        onClose={() => setEditItem(null)} onSave={save} />
    </View>
  );
}
const em = StyleSheet.create({
  body: { alignItems:'center', padding:24, paddingBottom:40 },
  badge: { width:80, height:80, borderRadius:40, backgroundColor:'#FEE2E2', alignItems:'center', justifyContent:'center', marginBottom:20 },
  bang: { fontSize:36, fontWeight:'900', color:C.red },
  title: { fontSize:28, fontWeight:'800', color:C.text, marginBottom:10 },
  sectionDesc: { fontSize:15, color:C.sub, textAlign:'center', lineHeight:24, marginBottom:20 },
  contactWrap: { position:'relative', width:'100%', alignItems:'center', marginBottom:16 },
  callBtn: { alignItems:'center', width:'100%' },
  circle: { width:120, height:120, borderRadius:60, alignItems:'center', justifyContent:'center', marginBottom:10, shadowOffset:{width:0,height:8}, shadowOpacity:0.4, shadowRadius:16, elevation:10 },
  callLabel: { fontSize:17, fontWeight:'700' },
  adminBtns: { position:'absolute', top:0, right:24, flexDirection:'row', gap:6 },
  editBtn: { width:28, height:28, borderRadius:14, backgroundColor:'#F59E0B', alignItems:'center', justifyContent:'center' },
  deleteBtn: { width:28, height:28, borderRadius:14, backgroundColor:C.red, alignItems:'center', justifyContent:'center' },
  note: { fontSize:13, color:C.sub, textAlign:'center', marginTop:24 },
});

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [tab,    setTab]    = useState(0);
  const [adminMode,  setAdminMode]  = useState(false);
  const [showAdmin,  setShowAdmin]  = useState(false);
  const [userName,   setUserName]   = useState('Marija');
  const [notes,      setNotes]      = useState('');
  const [routine,    setRoutine]    = useState<RoutineTask[]>(DEF_ROUTINE);
  const [reminders,  setReminders]  = useState<ReminderItem[]>(DEF_REMINDERS);
  const [family,     setFamily]     = useState<FamilyMember[]>(DEF_FAMILY);
  const [emergency,  setEmergency]  = useState<EmergencyContact[]>(DEF_EMERGENCY);

  useEffect(() => {
    (async () => {
      const savedName  = await AsyncStorage.getItem(SK.name);
      const savedNotes = await AsyncStorage.getItem(SK.notes);
      if (savedName)  setUserName(savedName);
      if (savedNotes) setNotes(savedNotes);
      setRoutine(  await loadData(SK.routine,   DEF_ROUTINE));
      setReminders(await loadData(SK.reminders, DEF_REMINDERS));
      setFamily(   await loadData(SK.family,    DEF_FAMILY));
      setEmergency(await loadData(SK.emergency, DEF_EMERGENCY));
    })();
  }, []);

  const updRoutine   = (v:RoutineTask[])      => { setRoutine(v);    saveData(SK.routine,   v); };
  const updReminders = (v:ReminderItem[])     => { setReminders(v);  saveData(SK.reminders, v); };
  const updFamily    = (v:FamilyMember[])     => { setFamily(v);     saveData(SK.family,    v); };
  const updEmergency = (v:EmergencyContact[]) => { setEmergency(v);  saveData(SK.emergency, v); };
  const updName      = (n:string)             => { setUserName(n);   AsyncStorage.setItem(SK.name,  n).catch(()=>{}); };
  const updNotes     = (n:string)             => { setNotes(n);      AsyncStorage.setItem(SK.notes, n).catch(()=>{}); };

  // ─── Reminder scheduler ───────────────────────────────────────────────────────
  const firedRef = useRef(new Set<string>());
  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const day  = now.toDateString();
      reminders.forEach(r => {
        if (r.time !== hhmm) return;
        const key = `${day}-${r.id}`;
        if (firedRef.current.has(key)) return;
        firedRef.current.add(key);
        playAudioTimes(r.audio, r.fallback, 3);
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(`⏰ ${r.label}`, { body: r.fallback, silent: true });
        }
      });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [reminders]);

  const go = (s:Screen, t?:number) => { setScreen(s); if (t !== undefined) setTab(t); };
  const openAdmin = () => setShowAdmin(true);
  const lockAdmin = () => { setAdminMode(false); Alert.alert('🔒', 'Admin mod zaključan.'); };
  const onAdminPress = () => adminMode ? lockAdmin() : openAdmin();
  const showNav = screen !== 'splash' && screen !== 'emergency';

  return (
    <PhoneWrapper>
      <StatusBar style="dark" />
      <AdminModal
        visible={showAdmin}
        onClose={() => setShowAdmin(false)}
        onSuccess={() => { setAdminMode(true); setShowAdmin(false); Alert.alert('✅ Admin mod', 'Možete uređivati sadržaj.'); }}
      />
      <View style={{ flex:1 }}>
        <View style={{ flex:1 }}>
          {screen==='splash'    && <SplashScreen    onGo={() => go('home',0)} />}
          {screen==='home'      && <HomeScreen      navigate={s => go(s)} userName={userName} adminMode={adminMode} onAdminPress={onAdminPress} onNameChange={updName} notes={notes} onNotesChange={updNotes} firstContact={emergency[0] ?? null} onEditFirstContact={(name,number) => updEmergency(emergency.map((c,i) => i===0 ? {...c,name,number} : c))} />}
          {screen==='routine'   && <RoutineScreen   onBack={() => go('home',0)} items={routine}   onChange={updRoutine}   adminMode={adminMode} onAdminPress={onAdminPress} />}
          {screen==='reminders' && <RemindersScreen onBack={() => go('home',0)} items={reminders} onChange={updReminders} adminMode={adminMode} onAdminPress={onAdminPress} />}
          {screen==='family'    && <FamilyScreen    onBack={() => go('home',0)} members={family}  onChange={updFamily}    adminMode={adminMode} onAdminPress={onAdminPress} />}
          {screen==='emergency' && <EmergencyScreen onBack={() => go('home',0)} contacts={emergency} onChange={updEmergency} adminMode={adminMode} onAdminPress={onAdminPress} />}
        </View>
        {showNav && <BottomNav active={tab} onNav={(s,i) => go(s,i)} />}
      </View>
    </PhoneWrapper>
  );
}
