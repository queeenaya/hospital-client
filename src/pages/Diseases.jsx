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

export const Diseases = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery("diseases", () => {
    return api.get("/diseases").then((res) => res.data);
  });

  const { data: diseaseTypeId } = useQuery("disease-types", () => {
    return api.get("/disease-types").then((res) => res.data);
  });

  const mutationDelete = useMutation({
    mutationFn: (params) => {
      return api.delete(`/diseases/${params}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("diseases");
    },
  });

  const mutationCreate = useMutation({
    mutationFn: (body) => {
      return api.post("/diseases", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("diseases");
      handleClose();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (body) => {
      return api.put("/diseases", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("diseases");
      handleCloseEdit();
    },
  });

  const onDelete = (id) => {
    mutationDelete.mutate(id);
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
    setSelected(rows.disease_code);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const formik = useFormik({
    initialValues: {
      disease_code: "",
      pathogen: "",
      description: "",
      id: 0,
    },
    onSubmit: (data, { resetForm }) => {
      onCreate({
        disease_code: data.disease_code,
        pathogen: data.pathogen,
        description: data.description,
        id: data.id,
      });
      resetForm();
    },
  });

  const formikEdit = useFormik({
    initialValues: {
      disease_code: selected,
      pathogen: "",
      description: "",
      id: 0,
    },
    onSubmit: (data, { resetForm }) => {
      onUpdate({
        disease_code: selected,
        pathogen: data.pathogen,
        description: data.description,
        id: data.id,
      });
      resetForm();
    },
  });

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Diseases</h2>
        <Button onClick={handleOpen}>
          <AddCircleIcon />
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center">Disease_code</TableCell>
              <TableCell align="center">Pathogen</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((rows) => (
              <TableRow key={rows.disease_code}>
                <TableCell align="center">{rows.disease_code}</TableCell>
                <TableCell align="center">{rows.pathogen}</TableCell>
                <TableCell align="center">{rows.description}</TableCell>
                <TableCell align="center">{rows.id}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEdit(rows)}>
                    <EditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onDelete(rows.disease_code)}>
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
              label="Disease_code"
              variant="outlined"
              name="disease_code"
              onChange={formik.handleChange}
              value={formik.values.disease_code}
            />
            <TextField
              required
              id="outlined-basic"
              label="Pathogen"
              variant="outlined"
              name="pathogen"
              onChange={formik.handleChange}
              value={formik.values.pathogen}
            />
            <TextField
              required
              id="outlined-basic"
              label="Description"
              variant="outlined"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
            />
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
              {(diseaseTypeId ?? []).map((row) => (
                <MenuItem key={row.id} value={row.id}>
                  {row.description}
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
              id="outlined-basic"
              label="Pathogen"
              variant="outlined"
              name="pathogen"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.pathogen}
            />
            <TextField
              required
              id="outlined-basic"
              label="Description"
              variant="outlined"
              name="description"
              onChange={formikEdit.handleChange}
              value={formikEdit.values.description}
            />
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
              {(diseaseTypeId ?? []).map((row) => (
                <MenuItem key={row.id} value={row.id}>
                  {row.description}
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
