import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text,View,TouchableOpacity,TextInput} from 'react-native';

export default function compraAuto() {
  const[costo,setCosto]= useState('');
  const [salario, setSalario] =useState('')
  const[transmision, setTransmision]= useState('manual');
  const [formaPago, setFormaPago] = useState('contado');

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

function calcularCredito(precioBase, formaPago, salario){
  let capitalFinal = precioBase;
  
  if(formaPago === 'credito'){
    capitalFinal = precioBase * Math.pow(1 + 0.08, 9); // 8% anual, 9 años
  }
  
  capitalFinal *= 1.07; // agregar ITBM
  
  const letraMensual = capitalFinal / (9*12);
  const aprobado = letraMensual <= salario*0.3 ? 'APROBADO' : 'NO APROBADO';
  

  
  return {capitalFinal, letraMensual, aprobado};
}

const {capitalFinal, letraMensual, aprobado} = calcularCredito(precioBase, formaPago, parseFloat(salario) || 0);

  return (
    <View style={styles.container}>
     <Text style={styles.titulo}>Venta de Autos</Text>
     <Text style={styles.label}>Costo:</Text>

     {/*input de costos*/}
     <TextInput style={styles.input}
     placeholder='Ingrese el costo. ej:15000'
     keyboardType='numeric'
     value={costo}
     onChangeText={setCosto}
     ></TextInput>

     {/*input de salarios*/}
     <TextInput style={styles.input}
     placeholder='Ingrese el salario'
     keyboardType='numeric'
     value={salario}
     onChangeText={setSalario}
     ></TextInput>

    {/*Radio Button Manual*/}
     <Text style={styles.label}>Transmisión</Text>
     <TouchableOpacity style={styles.radioOption} onPress={()=> setTransmision('manual')}>
      <View style={styles.radioCircle}>
      {transmision === 'manual' && <View style={styles.radioDot} />}
      </View>
      <Text>Manual</Text>
     </TouchableOpacity>

    {/*Radio Button automatico*/}
     <TouchableOpacity style={styles.radioOption} onPress={() => setTransmision('automatica')}>
     <View style={styles.radioCircle}>
     {transmision === 'automatica' && <View style={styles.radioDot} />}
     </View>
     <Text>Automática</Text>
    </TouchableOpacity>

    {/*Forma de Pago*/}
    <Text>Forma de Pago</Text>
    <TouchableOpacity onPress={() => setFormaPago('credito')} style={styles.radioOption}>
      <View style={styles.radioCircle}>
        {formaPago === 'credito' && <View style={styles.radioDot} />}
      </View>
      <Text>Crédito</Text>
    </TouchableOpacity>


    <TouchableOpacity onPress={() => setFormaPago('contado')} style={styles.radioOption}>
      <View style={styles.radioCircle}>
        {formaPago === 'contado' && <View style={styles.radioDot} />}
      </View>
      <Text>Contado</Text>
    </TouchableOpacity>

    
    <Text>30% del salario: {formato(salario * 0.3)}</Text>
    <Text>Letra mensual: {formato(letraMensual)}</Text>
    <Text>Estado crédito: {aprobado}</Text>


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