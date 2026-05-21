import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput,ScrollView } from 'react-native';

export default function CompraAuto() {
  const[costo,setCosto]= useState('');
  const [salario, setSalario] =useState('')
  const[transmision, setTransmision]= useState('manual');
  const [formaPago, setFormaPago] = useState('contado');
  const[mostrarResultado,setResultado]= useState(false);

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
const costoOriginal = parseFloat(costo) || 0;
const { precioBase, impuesto, granTotal } = calcularAuto(costoOriginal, transmision);

const formato = (n) =>
  `$${Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  
const credito = formaPago === 'credito'
  ? calcularCredito(precioBase, formaPago, parseFloat(salario) || 0)
  : { capitalFinal: 0, letraMensual: 0, aprobado: '' };

const { capitalFinal, letraMensual, aprobado } = credito;

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* ── ENCABEZADO ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Venta de Autos</Text>
      </View>

      {/* ── FORMULARIO ── */}
      <View style={styles.formBody}>

        {/* Input: costo del vehículo */}
        <Text style={styles.label}>Costo del vehículo</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            style={styles.input}
            placeholder="ej. 15000"
            keyboardType="numeric"
            value={costo}
            onChangeText={setCosto}
          />
        </View>

        
        {/* Input: salario mensual */}
        {formaPago === 'credito' && (
          <>
            <Text style={styles.label}>Salario mensual</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="ej. 1000"
                keyboardType="numeric"
                value={salario}
                onChangeText={setSalario}
              />
            </View>
          </>
        )}

        {/* Radio: tipo de transmisión */}
        <Text style={styles.sectionLabel}>Transmisión</Text>
        <View style={styles.radioGroup}>
          {['manual', 'automatica'].map((op) => (
            <TouchableOpacity
              key={op}
              style={[styles.radioBtn, transmision === op && styles.radioBtnActivo]}
              onPress={() => setTransmision(op)}
            >
              <View style={styles.radioCircle}>
                {transmision === op && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioText}>
                {op === 'manual' ? 'Manual' : 'Automática'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Radio: forma de pago */}
        <Text style={styles.sectionLabel}>Forma de pago</Text>
        <View style={styles.radioGroup}>
          {['contado', 'credito'].map((op) => (
            <TouchableOpacity
              key={op}
              style={[styles.radioBtn, formaPago === op && styles.radioBtnActivo]}
              onPress={() => {
                setFormaPago(op);
                setResultado(false);

                if (op === 'contado') {
                  setSalario('');
                }
              }}
              >
              <View style={styles.radioCircle}>
                {formaPago === op && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioText}>
                {op === 'contado' ? 'Contado' : 'Crédito'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón calcular */}
        <TouchableOpacity style={styles.calcBtn} onPress={() => setResultado(true)}>
          <Text style={styles.calcBtnTexto}>CALCULAR</Text>
        </TouchableOpacity>
      </View>

      {/* ── RESULTADOS — solo se muestra al presionar calcular ── */}
      {mostrarResultado && costoOriginal > 0 && (
        <View style={styles.resultSection}>

          {/* Badge verde = aprobado / rojo = no aprobado */}
          {formaPago === 'credito' && (
            <View style={[styles.statusBadge, aprobado === 'APROBADO' ? styles.badgeOk : styles.badgeMal]}>
              <Text style={[styles.statusTexto, aprobado === 'APROBADO' ? styles.statusTextoOk : styles.statusTextoMal]}>
                {aprobado}
              </Text>
            </View>
          )}

          {/* Una sola tarjeta con todos los montos */}
          <View style={styles.tarjeta}>

            {/* Fila: costo base */}
            <View style={styles.fila}>
              <Text style={styles.filaLabel}>Costo (base + transmisión)</Text>
              <Text style={styles.filaValor}>{formato(precioBase)}</Text>
            </View>

            {/* Fila: impuesto */}
            <View style={styles.fila}>
              <Text style={styles.filaLabel}>Impuesto (7% ITBM)</Text>
              <Text style={styles.filaValor}>{formato(impuesto)}</Text>
            </View>

            {/* Fila: gran total — más grande y destacado */}
            <View style={[styles.fila, styles.filaTotal]}>
              <Text style={styles.filaLabelTotal}>Gran Total</Text>
              <Text style={styles.filaValorTotal}>{formato(granTotal)}</Text>
            </View>

            {/* Línea separadora entre costos y crédito */}
            {formaPago === 'credito' && (
              <>
                <View style={styles.separador} />

                {/* Fila: capital final */}
                <View style={styles.fila}>
                  <Text style={styles.filaLabel}>Capital final</Text>
                  <Text style={styles.filaValor}>{formato(capitalFinal)}</Text>
                </View>

                {/* Fila: capacidad de pago */}
                <View style={styles.fila}>
                  <Text style={styles.filaLabel}>30% del salario</Text>
                  <Text style={styles.filaValor}>{formato((parseFloat(salario) || 0) * 0.3)}</Text>
                </View>

                {/* Fila: letra mensual */}
                <View style={styles.fila}>
                  <View>
                    <Text style={styles.letraLabel}>Letra mensual</Text>
                  </View>
                  <Text style={styles.letraValor}>{formato(letraMensual)}</Text>
                </View>
              </>
            )}

          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  // Fondo general de la pantalla
  contenedor: {
    flex: 1,
    backgroundColor: '#f4f9fb',
  },

  header: {
    backgroundColor: '#1d6a7a',     
    paddingTop: 60,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitulo: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },

  formBody: {
    padding: 20,
  },

  label: {
    fontSize: 13,
    color: '#5a7f8a',  
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 14,
  },

  // Contenedor del input con prefijo $
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#c8dfe5',           // borde azul claro
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
  },
  inputPrefix: {
    fontSize: 15,
    color: '#212f31',                 // azul petróleo
    fontWeight: '500',
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a3a42',                 // texto oscuro
  },

  // Etiqueta de sección (Transmisión, Forma de pago)
  sectionLabel: {
    fontSize: 13,
    color: '#5a7f8a',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },

  // Fila de botones radio
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },

  // Botón radio sin seleccionar
  radioBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#c8dfe5',           
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },

  // Botón radio cuando está seleccionado
  radioBtnActivo: {
    borderColor: '#1d6a7a',           
    backgroundColor: '#e1f5f0',      
  },

  // Círculo exterior del radio
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#c8dfe5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Punto interior del radio cuando está activo
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1d6a7a',      
  },

  radioText: {
    fontSize: 14,
    color: '#1a3a42',
  },

  // Botón principal CALCULAR
  calcBtn: {
    marginTop: 20,
    backgroundColor: '#1d6a7a',      
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  calcBtnTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  resultSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // Badge APROBADO / NO APROBADO
  statusBadge: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
  },
  badgeOk: {
    backgroundColor: '#eaf3de',      // verde muy claro
    borderColor: '#97c459',          // verde medio
  },
  badgeMal: {
    backgroundColor: '#fcebeb',      // rojo muy claro
    borderColor: '#f09595',          // rojo medio
  },
  statusTexto: {
    fontSize: 18,
    fontWeight: '500',
  },
  statusTextoOk: {
    color: '#3b6d11',                // verde oscuro
  },
  statusTextoMal: {
    color: '#a32d2d',                // rojo oscuro
  },

  // Tarjeta única que agrupa todos los montos
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8dfe5',          // borde azul claro
    padding: 16,
  },

  // Fila genérica label + valor
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c8dfe5',
  },
  filaLabel: {
    fontSize: 13,
    color: '#5a7f8a',                // gris azulado
    flex: 1,
  },
  filaValor: {
    fontSize: 14,
    color: '#1a3a42',
    fontWeight: '500',
  },

  // Fila Gran Total — sin borde inferior, texto más grande
  filaTotal: {
    borderBottomWidth: 0,
    paddingTop: 12,
  },
  filaLabelTotal: {
    fontSize: 15,
    color: '#1a3a42',
    fontWeight: '500',
  },
  filaValorTotal: {
    fontSize: 20,
    color: '#1d6a7a',               // azul petróleo destacado
    fontWeight: '500',
  },

  // Línea que separa costos de crédito dentro de la tarjeta
  separador: {
    height: 0.5,
    backgroundColor: '#c8dfe5',
    marginVertical: 10,
  },

  // Fila de letra mensual con subtítulo
  letraLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1d6a7a',
  },
  letraSub: {
    fontSize: 11,
    color: '#5a7f8a',
    marginTop: 2,
  },
  letraValor: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1d6a7a',               // azul petróleo
  },
});