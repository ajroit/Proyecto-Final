const { createApp } = Vue;

createApp({
  data() {
    return {
      expedientes: [],
      url: 'https://aroitman.pythonanywhere.com/expedientes',
      error: false,
      cargando: true,
      palabraClave: "",
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
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al obtener los datos.");
          }
          return response.json();
        })
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
    buscar() {
      if (this.palabraClave !== "") {
        const url = `${this.url}/buscar?q=${this.palabraClave}`;
        this.fetchData(url);
      } else {
        const url = `${this.url}/ordenar/${this.campoOrdenamiento}`;
        this.fetchData(url);
      }
    }
  },
  created() {
    let url = `${this.url}/ordenar/id`; // Ruta de ordenamiento por ID
    this.fetchData(url);
  },
  mounted() {
    const vm = this;
    this.$watch('palabraClave', function() {
      vm.buscar();
    });
  }
}).mount('#app');
