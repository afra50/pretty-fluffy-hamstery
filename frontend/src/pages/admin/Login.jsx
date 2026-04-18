import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../utils/api";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast"; // Przywracamy toast
import { FaPaw } from "react-icons/fa";
import "../../styles/forms.scss";
import "../../styles/pages/admin/login.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Wywołanie API logowania (backend ustawi ciastko z tokenem)
      await authApi.login(credentials);

      // Powiadomienie o sukcesie (style masz w App.jsx)
      toast.success("Zalogowano pomyślnie!");

      // Przekierowanie do panelu
      navigate("/admin");
    } catch (err) {
      // Wyświetlanie błędu z backendu pod formularzem
      setError(err.response?.data?.error || "Błędny login lub hasło");
      // Opcjonalnie dodatkowy toast z błędem
      // toast.error("Logowanie nie powiodło się");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <FaPaw className="paw-icon" />
          <h1>Panel Hodowcy</h1>
          <p>Witaj z powrotem w hodowli</p>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="username">
              Użytkownik
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className="form-group__input"
              placeholder="Wpisz login"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-group__input"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            className="admin-login__submit"
            disabled={isLoading}
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
