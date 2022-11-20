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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "../axios";

export const Countries = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery("countries", () => {
    return api.get("/countries").then((res) => res.data);
  });

  const mutationDelete = useMutation({
    mutationFn: (id) => {
      return api.delete(`/countries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("countries");
    },
  });

  const mutationCreate = useMutation({
    mutationFn: (body) => {
      return api.post("/countries", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("countries");
      handleClose();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (body) => {
      return api.put("/countries", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("countries");
      handleCloseEdit();
    },
  });

  const onDelete = (cname) => {
    mutationDelete.mutate(cname);
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
    setSelected(rows.cname);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const formik = useFormik({
    initialValues: {
      cname: "",
      population: 0,
    },
    onSubmit: (data, { resetForm }) => {
      const populationNum = Number(data.population);
      onCreate({ cname: data.cname, population: populationNum });
      resetForm();
    },
  });

  const formikEdit = useFormik({
    initialValues: {
      cname: selected,
      population: 0,
    },
    onSubmit: (data, { resetForm }) => {
      const populationNum = Number(data.population);
      onUpdate({ cname: selected, population: populationNum });
      resetForm();
    },
  });

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Countries</h2>
        <Button onClick={handleOpen}>
          <AddCircleIcon />
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center">Cname</TableCell>
              <TableCell align="center">Population</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((rows) => (
              <TableRow key={rows.cname}>
                <TableCell align="center">{rows.cname}</TableCell>
                <TableCell align="center">{rows.population}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEdit(rows)}>
                    <EditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onDelete(rows.cname)}>
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
              id="outlined-basic"
              label="Cname"
              variant="outlined"
              name="cname"
              onChange={formik.handleChange}
              value={formik.values.cname}
            />
            <TextField
            required
              id="outlined-basic"
              label="Population"
              variant="outlined"
              name="population"
              onChange={formik.handleChange}
              value={formik.values.population}
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
              label="Population"
              variant="outlined"
              name="population"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.population}
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
