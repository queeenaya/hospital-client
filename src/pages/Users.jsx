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

export const Users = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery("users", () => {
    return api.get("/users").then((res) => res.data);
  });

  const { data: countryNames } = useQuery("countries", () => {
    return api.get("/countries").then((res) => res.data);
  });

  const mutationDelete = useMutation({
    mutationFn: (params) => {
      return api.delete(`/users/${params}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  const mutationCreate = useMutation({
    mutationFn: (body) => {
      return api.post("/users", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      handleClose();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (body) => {
      return api.put("/users", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("users");
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
    setSelected(rows.email);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      surname: "",
      salary: 0,
      phone: "",
      cname: "",
    },
    onSubmit: (data, { resetForm }) => {
      const salaryNum = Number(data.salary);
      onCreate({
        email: data.email,
        name: data.name,
        surname: data.surname,
        salary: salaryNum,
        phone: data.phone,
        cname: data.cname,
      });
      resetForm();
    },
  });

  const formikEdit = useFormik({
    initialValues: {
      email: "",
      name: "",
      surname: "",
      salary: 0,
      phone: "",
      cname: "",
    },
    onSubmit: (data, { resetForm }) => {
      const salaryNum = Number(data.salary);
      onUpdate({
        email: selected,
        name: data.name,
        surname: data.surname,
        salary: salaryNum,
        phone: data.phone,
        cname: data.cname,
      });
      console.log(selected);
      resetForm();
    },
  });

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Users</h2>
        <Button onClick={handleOpen}>
          <AddCircleIcon />
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead
            sx={{
              borderBottom: "2px solid black",
            }}
          >
            <TableRow>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Surname</TableCell>
              <TableCell align="center">Salary</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Cname</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((rows) => (
              <TableRow key={rows.email}>
                <TableCell align="center">{rows.email}</TableCell>
                <TableCell align="center">{rows.name}</TableCell>
                <TableCell align="center">{rows.surname}</TableCell>
                <TableCell align="center">{rows.salary}</TableCell>
                <TableCell align="center">{rows.phone}</TableCell>
                <TableCell align="center">{rows.cname}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEdit(rows)}>
                    <EditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onDelete(rows.email)}>
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
              type="email"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              placeholder="example@gmail.com"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <TextField
              required
              id="outlined-basic"
              label="Name"
              variant="outlined"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <TextField
              required
              id="outlined-basic"
              label="Surname"
              variant="outlined"
              name="surname"
              onChange={formik.handleChange}
              value={formik.values.surname}
            />
            <TextField
              required
              id="outlined-basic"
              label="Salary"
              variant="outlined"
              name="salary"
              onChange={formik.handleChange}
              value={formik.values.salary}
            />
            <TextField
              required
              id="outlined-basic"
              label="Phone"
              variant="outlined"
              name="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
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
              id="outlined-basic"
              label="Name"
              variant="outlined"
              name="name"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.name}
            />
            <TextField
              required
              id="outlined-basic"
              label="Surname"
              variant="outlined"
              name="surname"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.surname}
            />
            <TextField
              required
              id="outlined-basic"
              label="Salary"
              variant="outlined"
              name="salary"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.salary}
            />
            <TextField
              required
              id="outlined-basic"
              label="Phone"
              variant="outlined"
              name="phone"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.phone}
            />
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
