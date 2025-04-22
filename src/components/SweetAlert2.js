import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import '../styles/SweetAlert2Theme.css'; // Importar estilos personalizados

const SweetAlert2 = async (options) => {
  // Determinar el tema actual (puedes usar un contexto, localStorage, etc.)
  const theme = localStorage.getItem('theme') || 'light';

  // Configurar SweetAlert2 con el tema correspondiente
  const result = await Swal.fire({
    ...options,
    customClass: {
      popup: theme === 'dark' ? 'swal2-dark' : 'swal2-light',
    },
  });

  // Devolver el resultado de la alerta
  return result;
};

export default SweetAlert2;