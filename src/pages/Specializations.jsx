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

export const Specializations = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery("specializations", () => {
    return api.get("/specializations").then((res) => res.data);
  });

  const { data: doctorEmails } = useQuery("doctors", () => {
    return api.get("/doctors").then((res) => res.data);
  });

  const { data: diseaseTypes } = useQuery("disease-types", () => {
    return api.get("/disease-types").then((res) => res.data);
  });

  const mutationDelete = useMutation({
    mutationFn: (params) => {
      return api.delete(`/specializations/${params}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("specializations");
    },
  });

  const mutationCreate = useMutation({
    mutationFn: (body) => {
      return api.post("/specializations", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("specializations");
      handleClose();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (body) => {
      return api.put("/specializations", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("specializations");
      handleCloseEdit();
    },
  });

  const onDelete = (id_s) => {
    mutationDelete.mutate(id_s);
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
      id: 0,
      email: "",
    },
    onSubmit: (data, { resetForm }) => {
      onCreate({
        id_s: data.id_s,
        id: data.id,
        email: data.email,
      });
      resetForm();
    },
  });

  const formikEdit = useFormik({
    initialValues: {
      id_s: 0,
      id: 0,
      email: "",
    },
    onSubmit: (data, { resetForm }) => {
      onUpdate({
        id_s: selected,
        id: data.id,
        email: data.email,
      });
      resetForm();
    },
  });

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Specializations</h2>
        <Button onClick={handleOpen}>
          <AddCircleIcon />
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center">Id</TableCell>
              <TableCell align="center">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((rows) => (
              <TableRow key={rows.id_s}>
                <TableCell align="center">{rows.id}</TableCell>
                <TableCell align="center">{rows.email}</TableCell>
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
              label="Id"
              variant="outlined"
              name="id"
              onChange={formik.handleChange}
              value={formik.values.id}
            >
              {(diseaseTypes ?? []).map((row) => (
                <MenuItem key={row.id} value={row.id}>
                  {row.description}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              select
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            >
              {(doctorEmails ?? []).map((row) => (
                <MenuItem key={row.email} value={row.email}>
                  {row.email}
                </MenuItem>
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
              select
              id="outlined-basic"
              label="Id"
              variant="outlined"
              name="id"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.id}
            >
              {(diseaseTypes ?? []).map((row) => (
                <MenuItem key={row.id} value={row.id}>
                  {row.description}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              select
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.email}
            >
              {(doctorEmails ?? []).map((row) => (
                <MenuItem key={row.email} value={row.email}>
                  {row.email}
                </MenuItem>
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
