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

export const Doctors = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery("doctors", () => {
    return api.get("/doctors").then((res) => res.data);
  });

  const { data: users } = useQuery("users", () => {
    return api.get("/users").then((res) => res.data);
  });

  const { data: publicServants } = useQuery("public-servants", () => {
    return api.get("/public-servants").then((res) => res.data);
  });

  const mutationDelete = useMutation({
    mutationFn: (params) => {
      return api.delete(`/doctors/${params}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("doctors");
    },
  });

  const mutationCreate = useMutation({
    mutationFn: (body) => {
      return api.post("/doctors", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("doctors");
      handleClose();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (body) => {
      return api.put("/doctors", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("doctors");
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
      degree: "",
    },
    onSubmit: (data, { resetForm }) => {
      onCreate({
        email: data.email,
        degree: data.degree,
      });
      resetForm();
    },
  });

  const formikEdit = useFormik({
    initialValues: {
      email: "",
      degree: "",
    },
    onSubmit: (data, { resetForm }) => {
      onUpdate({
        email: selected,
        degree: data.degree,
      });
      resetForm();
    },
  });

  const doctorEmails = (data ?? []).map((row) => row.email);
  const publicServantEmails = (publicServants ?? []).map((row) => row.email);
  const userEmails = (users ?? []).map((row) => row.email);
  const emailsToShow = (userEmails ?? []).filter(
    (email) =>
      !doctorEmails.includes(email) && !publicServantEmails.includes(email)
  );

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Doctors</h2>
        <Button onClick={handleOpen}>
          <AddCircleIcon />
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Degree</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((rows) => (
              <TableRow key={rows.email}>
                <TableCell align="center">{rows.email}</TableCell>
                <TableCell align="center">{rows.degree}</TableCell>
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
              select
              id="outlined-basic"
              label="Email"
              variant="outlined"
              placeholder="example@gmail.com"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            >
              {(emailsToShow ?? []).map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              id="outlined-basic"
              label="Degree"
              variant="outlined"
              name="degree"
              onChange={formik.handleChange}
              value={formik.values.degree}
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
              id="outlined-basic"
              label="Degree"
              variant="outlined"
              name="degree"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.degree}
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
