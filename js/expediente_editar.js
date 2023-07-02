console.log(location.search); // lee los argumentos pasados a este formulario
var id = location.search.substr(4);
console.log(id);
const { createApp } = Vue;
createApp({
  data() {
    return {
      id: 0,
      caratula: "",
      numero_expediente: "",
      juzgado: "",
      estado_actual: "",
      url: "https://aroitman.pythonanywhere.com/expedientes/" + id,
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.id = data.id;
          this.caratula = data.caratula;
          this.numero_expediente = data.numero_expediente;
          this.juzgado = data.juzgado;
          this.estado_actual = data.estado_actual;
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
        });
    },
    modificar() {
      let expediente = {
        id: this.id,
        caratula: this.caratula,
        numero_expediente: this.numero_expediente,
        juzgado: this.juzgado,
        estado_actual: this.estado_actual,
      };
      var options = {
        body: JSON.stringify(expediente),
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };
      fetch(this.url, options)
        .then(() => {
          alert("Registro modificado");
          window.location.href = "../templates/expedientes.html";
        })
        .catch((err) => {
          console.error(err);
          alert("Error al Modificar");
        });
    },
  },
  created() {
    this.fetchData(this.url);
  },
}).mount("#app");
