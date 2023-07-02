const { createApp } = Vue;
createApp({
  data() {
    return {
      expedientes: [],
      url: 'https://aroitman.pythonanywhere.com/expedientes',
      error: false,
      cargando: true,
      id: 0,
      caratula: "",
      numero_expediente: "",
      juzgado: "",
      estado_actual: "",
      opcionesEstado: ["Inicio", "Prueba", "Ejecución", "Archivado"],
      campoOrdenamiento: "id" // Campo de ordenamiento por defecto: ID
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.expedientes = data;
          this.cargando = false;
        })
        .catch(err => {
          console.error(err);
          this.error = true;
        });
    },
    eliminar(expediente) {
      if (confirm('¿Estás seguro de que deseas eliminar este expediente?')) {
        const url = `${this.url}/${expediente}`;
        var options = {
          method: 'DELETE',
        };
        fetch(url, options)
          .then(res => res.text())
          .then(res => {
            location.reload();
          })
          .catch(err => {
            console.error(err);
            alert("Error al eliminar el expediente.");
          });
      }
    },
    grabar() {
      let expediente = {
        id: this.id,
        caratula: this.caratula,
        numero_expediente: this.numero_expediente,
        juzgado: this.juzgado,
        estado_actual: this.estado_actual
      };
      console.log('Expediente a enviar:', expediente);

      var options = {
        body: JSON.stringify(expediente),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
      };
      fetch(this.url, options)
        .then(response => {
          console.log('Respuesta:', response);
          if (response.ok) {
            alert("Registro grabado");
            window.location.href = "expedientes.html";
          } else {
            throw new Error("Error al grabar");
          }
        })
        .catch(err => {
          console.error(err);
          alert(err.message);
        });
    },
    ordenarPor(campo) {
      // Establece el campo de ordenamiento actual
      this.campoOrdenamiento = campo;

      // Realiza la solicitud al backend para obtener los registros ordenados por el campo seleccionado
      let url = this.url;
      if (campo === "id") {
        url += "/ordenar/id";
      } else if (campo === "estado_actual") {
        url += "/ordenar/estado";
      }
      this.fetchData(url);
    }
  },
  created() {
    this.fetchData(this.url);
  },
}).mount('#app');
