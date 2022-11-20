import { React, useState } from "react";
import { useFormik } from "formik";
import {
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "../axios";

export const Records = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery("records", () => {
    return api.get("/records").then((res) => res.data);
  });

  const { data: publicServants } = useQuery("public-servants", () => {
    return api.get("/public-servants").then((res) => res.data);
  });

  const { data: countryNames } = useQuery("countries", () => {
    return api.get("/countries").then((res) => res.data);
  });

  const { data: diseaseCodes } = useQuery("diseases", () => {
    return api.get("/diseases").then((res) => res.data);
  });

  const mutationDelete = useMutation({
    mutationFn: (params) => {
      return api.delete(`/records/${params}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("records");
    },
  });

  const mutationCreate = useMutation({
    mutationFn: (body) => {
      return api.post("/records", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("records");
      handleClose();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (body) => {
      return api.put("/records", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("records");
      handleCloseEdit();
    },
  });

  const onDelete = (email) => {
    mutationDelete.mutate(email);
  };

  const onCreate = (body) => {
    mutationCreate.mutate(body);
  };

  const onUpdate = (body) => {
    mutationUpdate.mutate(body);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [selected, setSelected] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = (rows) => {
    formikEdit.setValues(rows);
    setSelected(rows.id_s);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const formik = useFormik({
    initialValues: {
      id_s: 0,
      email: "",
      cname: "",
      disease_code: "",
      total_deaths: 0,
      total_patients: 0,
    },
    onSubmit: (data, { resetForm }) => {
      const deaths = Number(data.total_deaths);
      const patients = Number(data.total_patients);
      onCreate({
        id_s: data.id_s,
        email: data.email,
        cname: data.cname,
        disease_code: data.disease_code,
        total_deaths: deaths,
        total_patients: patients,
      });
      resetForm();
    },
  });

  const formikEdit = useFormik({
    initialValues: {
      id_s: 0,
      email: "",
      cname: "",
      disease_code: "",
      total_deaths: 0,
      total_patients: 0,
    },
    onSubmit: (data, { resetForm }) => {
      const deaths = Number(data.total_deaths);
      const patients = Number(data.total_patients);
      onUpdate({
        id_s: selected,
        email: data.email,
        cname: data.cname,
        disease_code: data.disease_code,
        total_deaths: deaths,
        total_patients: patients,
      });
      resetForm();
    },
  });

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Records</h2>
        <Button onClick={handleOpen}>
          <AddCircleIcon />
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Cname</TableCell>
              <TableCell align="center">Disease_code</TableCell>
              <TableCell align="center">Total_deaths</TableCell>
              <TableCell align="center">Total_patients</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((rows) => (
              <TableRow key={rows.id_s}>
                <TableCell align="center">{rows.email}</TableCell>
                <TableCell align="center">{rows.cname}</TableCell>
                <TableCell align="center">{rows.disease_code}</TableCell>
                <TableCell align="center">{rows.total_deaths}</TableCell>
                <TableCell align="center">{rows.total_patients}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEdit(rows)}>
                    <EditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onDelete(rows.id_s)}>
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" onSubmit={formik.handleSubmit} sx={style}>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
              alignItems: "center",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              required
              select
              id="outlined-basic"
              label="Email"
              variant="outlined"
              placeholder="example@gmail.com"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            >
              {(publicServants ?? []).map((row) => (
                <MenuItem key={row.email} value={row.email}>{row.email}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              select
              id="outlined-basic"
              label="Cname"
              variant="outlined"
              name="cname"
              onChange={formik.handleChange}
              value={formik.values.cname}
            >
              {(countryNames ?? []).map((row) => (
                <MenuItem key={row.cname} value={row.cname}>{row.cname}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              select
              id="outlined-basic"
              label="Disease_code"
              variant="outlined"
              name="disease_code"
              onChange={formik.handleChange}
              value={formik.values.disease_code}
            >
              {(diseaseCodes ?? []).map((row) => (
                <MenuItem key={row.disease_code} value={row.disease_code}>{row.disease_code}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              id="outlined-basic"
              label="Total_deaths"
              variant="outlined"
              name="total_deaths"
              onChange={formik.handleChange}
              value={formik.values.total_deaths}
            />
            <TextField
              required
              id="outlined-basic"
              label="Total_patients"
              variant="outlined"
              name="total_patients"
              onChange={formik.handleChange}
              value={formik.values.total_patients}
            />
            <Button
              sx={{ marginTop: "20px" }}
              variant="contained"
              type="submit"
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" onSubmit={formikEdit.handleSubmit} sx={style}>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
              alignItems: "center",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              required
              select
              id="outlined-basic"
              label="Email"
              variant="outlined"
              placeholder="example@gmail.com"
              name="email"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.email}
            >
              {(publicServants ?? []).map((row) => (
                <MenuItem key={row.email} value={row.email}>{row.email}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              select
              id="outlined-basic"
              label="Cname"
              variant="outlined"
              name="cname"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.cname}
            >
              {(countryNames ?? []).map((row) => (
                <MenuItem key={row.cname} value={row.cname}>{row.cname}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              select
              id="outlined-basic"
              label="Disease_code"
              variant="outlined"
              name="disease_code"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.disease_code}
            >
              {(diseaseCodes ?? []).map((row) => (
                <MenuItem key={row.disease_code} value={row.disease_code}>{row.disease_code}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              id="outlined-basic"
              label="Total_deaths"
              variant="outlined"
              name="total_deaths"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.total_deaths}
            />
            <TextField
              required
              id="outlined-basic"
              label="Total_patients"
              variant="outlined"
              name="total_patients"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.total_patients}
            />
            <Button
              sx={{ marginTop: "20px" }}
              variant="contained"
              type="submit"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
