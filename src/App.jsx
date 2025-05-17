import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch("https://sms.ilmwasooli.com/temp/gettestingdata")
      .then((response) => response.json())
      .then((json) => {
        setData(json.Data);
        const distinctClasses = [
          ...new Set(json.Data.map((item) => item.Class)),
        ];
        setClasses(distinctClasses);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const filteredData = data.filter((item) => {
    const matchesClass =
      selectedClass === "All" || item.Class === selectedClass;
    const lowerSearch = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(lowerSearch) ||
      item.Class.toLowerCase().includes(lowerSearch) ||
      item.status.toLowerCase().includes(lowerSearch) ||
      formatDate(item.admissiondts).includes(lowerSearch) ||
      item.id.toString().includes(lowerSearch);

    return matchesClass && matchesSearch;
  });

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-primary fw-bold">
        Student Data Table
      </h2>

      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control border-primary shadow-sm"
            placeholder="Search by any field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select border-primary shadow-sm"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="All">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive shadow rounded">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Admission Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <tr
                  key={user.id}
                  className={
                    user.status === "Present" ? "table-success" : "table-danger"
                  }
                >
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.Class}</td>
                  <td>{formatDate(user.admissiondts)}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === "Present" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted fst-italic">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
