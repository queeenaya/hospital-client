import { React, useState } from "react";
import { useFormik } from "formik";
import * as moment from "moment";
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

export const Discoveries = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery("discoveries", () => {
    return api.get("/discoveries").then((res) => res.data);
  });

  const { data: diseaseCodes } = useQuery("diseases", () => {
    return api.get("/diseases").then((res) => res.data);
  });

  const { data: countryNames } = useQuery("countries", () => {
    return api.get("/countries").then((res) => res.data);
  });

  const mutationDelete = useMutation({
    mutationFn: (params) => {
      return api.delete(`/discoveries/${params}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("discoveries");
    },
  });

  const mutationCreate = useMutation({
    mutationFn: (body) => {
      return api.post("/discoveries", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("discoveries");
      handleClose();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (body) => {
      return api.put("/discoveries", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("discoveries");
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
    rows.first_enc_date = moment.utc(rows.first_enc_date).format("YYYY-MM-DD");
    formikEdit.setValues(rows);
    setSelected(rows.id_s);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const formik = useFormik({
    initialValues: {
      id_s: null,
      cname: "",
      disease_code: "",
      first_enc_date: "",
    },
    onSubmit: (data, { resetForm }) => {
      onCreate({
        id_s: data.id_s,
        cname: data.cname,
        disease_code: data.disease_code,
        first_enc_date: data.first_enc_date,
      });
      resetForm();
    },
  });

  const formikEdit = useFormik({
    initialValues: {
      id_s: null,
      cname: "",
      disease_code: "",
      first_enc_date: "",
    },
    onSubmit: (data, { resetForm }) => {
      onUpdate({
        id_s: selected,
        cname: data.cname,
        disease_code: data.disease_code,
        first_enc_date: data.first_enc_date,
      });
      resetForm();
    },
  });

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Discoveries</h2>
        <Button onClick={handleOpen}>
          <AddCircleIcon />
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center">Cname</TableCell>
              <TableCell align="center">Disease_code</TableCell>
              <TableCell align="center">First_enc_date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((rows) => (
              <TableRow key={rows.id_s}>
                <TableCell align="center">{rows.cname}</TableCell>
                <TableCell align="center">{rows.disease_code}</TableCell>
                <TableCell align="center">
                  {moment.utc(rows.first_enc_date).format("YYYY-MM-DD")}
                </TableCell>
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
              label="First_enc_date"
              variant="outlined"
              placeholder="YYYY-MM-DD"
              name="first_enc_date"
              onChange={formik.handleChange}
              value={formik.values.first_enc_date}
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
              label="First_enc_date"
              variant="outlined"
              placeholder="YYYY-MM-DD"
              name="first_enc_date"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.first_enc_date}
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
