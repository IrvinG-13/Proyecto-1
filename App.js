import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView,Alert } from 'react-native';

export default function CompraAuto() {
  // ========= Variables de estado =========
  const [costo, setCosto] = useState('');
  const [salario, setSalario] = useState('');
  const [transmision, setTransmision] = useState('manual');
  const [formaPago, setFormaPago] = useState('contado');
  const [mostrarResultado, setResultado] = useState(false);

  // ========= Cálculos de manual y automático =========
  function calcularAuto(costoOriginal, transmision) {
    let precioBase;

    switch (transmision) {
      case 'automatica':
        precioBase = costoOriginal + 1500;
        break;

      case 'manual':
        precioBase = costoOriginal;
        break;

      default:
        precioBase = costoOriginal;
        break;
    }

    const impuesto = precioBase * 0.07;
    const granTotal = precioBase + impuesto;

    return { precioBase, impuesto, granTotal };
  }

  // ========= Cálculo del crédito a 9 años =========
  function calcularCredito(precioBase, salario) {
    let capitalFinal = precioBase;

    // 8% anual durante 9 años
    capitalFinal = precioBase * Math.pow(1 + 0.08, 9);

    // Agregar ITBM
    capitalFinal = capitalFinal * 1.07;

    const letraMensual = capitalFinal / (9 * 12);
    const treintaSalario = salario * 0.3;

    const aprobado = letraMensual <= treintaSalario ? 'APROBADO' : 'NO APROBADO';

    return { letraMensual, treintaSalario, aprobado };
  }

  const costoOriginal = parseFloat(costo) || 0;
  const salarioMensual = parseFloat(salario) || 0;

  const { precioBase, impuesto, granTotal } = calcularAuto(costoOriginal, transmision);

  const credito = formaPago === 'credito'
    ? calcularCredito(precioBase, salarioMensual)
    : { letraMensual: 0, treintaSalario: 0, aprobado: '' };

  const { letraMensual, treintaSalario, aprobado } = credito;

  // ========= Función para formato de dinero =========
  const formato = (n) =>
    `$${Number(n || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  })}`;

  const salarioAlerta = () => {
      if (formaPago === 'credito' && salario.trim() === '') {
        Alert.alert(
          'Salario requerido',
          'Debe ingresar un salario mensual para calcular el crédito.'
        );
        return;
      }

      setResultado(true);
  };

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="light" />

      {/* ENCABEZADO */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Venta de Autos</Text>
      </View>

      {/* FORMULARIO */}
      <View style={styles.formBody}>

        {/* Costo del carro */}
        <Text style={styles.label}>Costo del vehículo</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: 15000"
            keyboardType="numeric"
            value={costo}
            onChangeText={setCosto}
          />
        </View>

        {/* Salario mensual, solo si es crédito */}
        {formaPago === 'credito' && (
          <>
            <Text style={styles.label}>Salario mensual</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: 900"
                keyboardType="numeric"
                value={salario}
                onChangeText={setSalario}
              />
            </View>
          </>
        )}

        {/* Transmisión */}
        <Text style={styles.sectionLabel}>Transmisión</Text>
        <View style={styles.radioGroup}>
          {['manual', 'automatica'].map((op) => (
            <TouchableOpacity
              key={op}
              style={[styles.radioBtn, transmision === op && styles.radioBtnActivo]}
              onPress={() => {
                setTransmision(op);
                setResultado(false);
              }}
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

        {/* Forma de pago */}
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
        <TouchableOpacity style={styles.calcBtn} onPress={salarioAlerta}>
          <Text style={styles.calcBtnTexto}>CALCULAR</Text>
        </TouchableOpacity>
      </View>

      {/* RESULTADOS */}
      {mostrarResultado && costoOriginal > 0 && (
        <View style={styles.resultSection}>

          {formaPago === 'credito' ? (
            <>
              {/* Solo APROBADO o NO APROBADO */}
              <View
                style={[
                  styles.statusBadge,
                  aprobado === 'APROBADO' ? styles.badgeOk : styles.badgeMal,
                ]}
              >
                <Text
                  style={[
                    styles.statusTexto,
                    aprobado === 'APROBADO' ? styles.statusTextoOk : styles.statusTextoMal,
                  ]}
                >
                  {aprobado}
                </Text>
              </View>

              {/* Resultados de crédito */}
              <View style={styles.tarjeta}>
                <View style={styles.fila}>
                  <Text style={styles.filaLabel}>30% del salario</Text>
                  <Text style={styles.filaValor}>{formato(treintaSalario)}</Text>
                </View>

                <View style={[styles.fila, styles.filaTotal]}>
                  <Text style={styles.filaLabelTotal}>Letra mensual</Text>
                  <Text style={styles.filaValorTotal}>{formato(letraMensual)}</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Resultados de contado */}
              <View style={styles.tarjeta}>
                <View style={styles.fila}>
                  <Text style={styles.filaLabel}>Costo base + transmisión</Text>
                  <Text style={styles.filaValor}>{formato(precioBase)}</Text>
                </View>

                <View style={styles.fila}>
                  <Text style={styles.filaLabel}>Impuesto 7% ITBM</Text>
                  <Text style={styles.filaValor}>{formato(impuesto)}</Text>
                </View>

                <View style={[styles.fila, styles.filaTotal]}>
                  <Text style={styles.filaLabelTotal}>Total a pagar</Text>
                  <Text style={styles.filaValorTotal}>{formato(granTotal)}</Text>
                </View>
              </View>
            </>
          )}

        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#c8dfe5',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
  },

  inputPrefix: {
    fontSize: 15,
    color: '#212f31',
    fontWeight: '500',
    marginRight: 6,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a3a42',
  },

  sectionLabel: {
    fontSize: 13,
    color: '#5a7f8a',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },

  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },

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

  radioBtnActivo: {
    borderColor: '#1d6a7a',
    backgroundColor: '#e1f5f0',
  },

  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#c8dfe5',
    alignItems: 'center',
    justifyContent: 'center',
  },

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

  statusBadge: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
  },

  badgeOk: {
    backgroundColor: '#eaf3de',
    borderColor: '#97c459',
  },

  badgeMal: {
    backgroundColor: '#fcebeb',
    borderColor: '#f09595',
  },

  statusTexto: {
    fontSize: 18,
    fontWeight: '500',
  },

  statusTextoOk: {
    color: '#3b6d11',
  },

  statusTextoMal: {
    color: '#a32d2d',
  },

  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8dfe5',
    padding: 16,
  },

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
    color: '#5a7f8a',
    flex: 1,
  },

  filaValor: {
    fontSize: 14,
    color: '#1a3a42',
    fontWeight: '500',
  },

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
    color: '#1d6a7a',
    fontWeight: '500',
  },
});