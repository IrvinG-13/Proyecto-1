import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text,View,TouchableOpacity,TextInput} from 'react-native';

export default function compraAuto() {
  const[costo,setCosto]= useState('');
  const[transmision, setTransmision]= useState('manual');

  //Calculos de manual y automatico
function calcularAuto(costoOriginal,transmision){
let precioBase;

switch(transmision){
  case 'automatica':
    precioBase = costoOriginal + 1500;
    break;
  
  case 'manual':
    precioBase = costoOriginal;
    break;
}

const impuesto = precioBase*0.07;
const granTotal = precioBase + impuesto;

return{precioBase,impuesto,granTotal};
}
const costoOriginal = parseFloat(costo) || 0;
const { precioBase, impuesto, granTotal } = calcularAuto(costoOriginal, transmision);
const formato = (n) => `$${n.toFixed(2)}`;

  return (
    <View style={styles.container}>
     <Text style={styles.titulo}>Venta de Autos</Text>
     <Text style={styles.label}>Costo:</Text>
     <TextInput style={styles.input}
     placeholder='Ingrese el costo. ej:15000'
     keyboardType='numeric'
     value={costo}
     onChangeText={setCosto}
     ></TextInput>

     <Text style={styles.label}>Transmisión</Text>
     <TouchableOpacity style={styles.radioOption} onPress={()=> setTransmision('manual')}>
      <View style={styles.radioCircle}>
      {transmision === 'manual' && <View style={styles.radioDot} />}
      </View>
      <Text>Manual</Text>
     </TouchableOpacity>

     <TouchableOpacity style={styles.radioOption} onPress={() => setTransmision('automatica')}>
     <View style={styles.radioCircle}>
     {transmision === 'automatica' && <View style={styles.radioDot} />}
     </View>
     <Text>Automática</Text>
      </TouchableOpacity>

     {costoOriginal > 0 && (
     <View style={styles.resultado}>
     <Text>Costo:      {formato(precioBase)}</Text>
     <Text>Impuesto:   {formato(impuesto)}</Text>
     <Text>Gran total: {formato(granTotal)}</Text>
    </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:24,
    backgroundColor:'#fff'
  },

  titulo:{
    fontSize:22,
    fontWeight:'600',
    marginTop:'20',
    textAlign:'center'
  },

  label:{
    fontSize:14,
    color: '#555', 
    marginTop: 14, 
    marginBottom: 6,
  },

  input:{
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 10, 
    fontSize: 16 
  },

  radioOption:{
    flexDirection:'row',
    alignItems: 'center', 
    gap: 10, 
    marginBottom: 8
  },

  radioCircle:{
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#333', 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  radioDot:{
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#333'
  },

  resultado:{
    marginTop: 24, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 12, 
    padding: 16, 
    gap: 8 
  },
});