import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function ProductTable() {
  const [products, setProducts] = React.useState([]);
  const [selectedProductId, setSelectedProductId] = React.useState();
  const [showForm, setShowForm] = React.useState(false);

  const [productName, setProductName] = React.useState();
  const [supplierId, setSupplierId] = React.useState();
  const [unitPrice, setUnitPrice] = React.useState();

  const getProducts = () => {
    axios.get(`http://localhost:9090/getProducts`).then((res) => {
      const products = res.data;
      setProducts(products);
    });
  };

  const deleteProduct = (productId) => {
    axios
      .delete(`http://localhost:9090/delProducts?id=${productId}`)
      .then((res) => {
        if (res.status === 200) {
          alert("Deleted successfully");
          getProducts();
        }
      });
  };

  const addNewProduct = () => {
    axios
      .post(`http://localhost:9090/addProducts`, {
        productName,
        supplierId,
        unitPrice,
      })
      .then((res) => {
        alert("Added successfully");
        getProducts();
        setShowForm(false);
      })
      .catch((err) => alert("Save failed"));
  };

  const updateProduct = () => {
    axios
      .put(`http://localhost:9090/updProducts?id=${selectedProductId}`, {
        productName,
        supplierId,
        unitPrice,
      })
      .then((res) => {
        alert("Updated successfully");
        getProducts();
        setShowForm(false);
      })
      .catch((err) => alert("Update failed"));
  };

  React.useEffect(() => {
    if (products?.length < 1) {
      getProducts();
    }
  }, []);

  React.useEffect(() => {
    if (products.length > 0) {
      console.log({ products });
    }
  }, [products]);

  const addRow = () => {
    setSelectedProductId(0);
    setShowForm(true);
  };

  const editRow = (productId) => {
    setSelectedProductId(productId);
    setShowForm(true);
  };

  React.useEffect(() => {
    const selectedProduct = products?.find(
      (product) => product.productId === selectedProductId
    );

    setProductName(selectedProduct?.productName ?? "");
    setSupplierId(selectedProduct?.supplierId ?? "");
    setUnitPrice(selectedProduct?.unitPrice ?? "");
  }, [selectedProductId]);

  return (
    <div style={{ position: "relative" }}>
      <Button
        variant="contained"
        style={{ position: "absolute", right: 0 }}
        onClick={() => {
          addRow();
        }}
      >
        Add New
      </Button>

      {showForm && (
        <Paper style={{ padding: 32, marginTop: 50, display: "flex" }}>
          <TextField
            label="Product Name"
            value={productName}
            onChange={(e) => {
              setProductName(e.currentTarget.value);
            }}
          />
          <TextField
            label="Supplier Id"
            style={{ marginLeft: 16 }}
            value={supplierId}
            onChange={(e) => {
              setSupplierId(e.currentTarget.value);
            }}
          />
          <TextField
            label="Unit Price"
            style={{ marginLeft: 16 }}
            value={unitPrice}
            onChange={(e) => {
              setUnitPrice(e.currentTarget.value);
            }}
          />
          <Button
            variant="contained"
            style={{ marginLeft: 16 }}
            onClick={() => {
              if (selectedProductId === 0) {
                addNewProduct();
              } else {
                updateProduct();
              }
            }}
          >
            {selectedProductId === 0 ? "Save" : "Update"}
          </Button>
        </Paper>
      )}
      <TableContainer component={Paper} style={{ width: 700, marginTop: 50 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">#</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell align="left">Product Id</StyledTableCell>
              <StyledTableCell align="left">Supplier Id</StyledTableCell>
              <StyledTableCell align="left">Unit Price</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product) => (
              <StyledTableRow key={product.productId}>
                <StyledTableCell component="th" scope="row">
                  <DeleteIcon
                    style={{ cursor: "pointer", width: 20, height: 20 }}
                    onClick={() => {
                      deleteProduct(product.productId);
                    }}
                  />
                  <EditIcon
                    style={{ cursor: "pointer", width: 20, height: 20 }}
                    onClick={() => {
                      editRow(product.productId);
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {product.productName}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {product.productId}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {product.supplierId}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {product.unitPrice}
                </StyledTableCell>
              </StyledTableRow>
            )) ?? "No data found"}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
