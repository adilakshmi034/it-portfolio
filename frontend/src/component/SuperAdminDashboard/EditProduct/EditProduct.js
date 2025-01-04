import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import axiosInstance from '../../../axiosInstance';

const UpdateProduct = () => {
    const [product, setProduct] = useState({
        productName: '',
        productDescription: '',
        price: '',
        discountPrice: '',
        rating: '',
        image: null,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id: productId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/getby/${productId}`);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product', error);
                setError('Failed to load product data.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setProduct((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        for (const key in product) {
            formData.append(key, product[key]);
        }

        try {
            await axiosInstance.put(`${process.env.REACT_APP_API_URL}/api/products/update/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                title: 'Success!',
                text: 'Product updated successfully!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            });
            navigate(-1);
        } catch (error) {
            console.error('Error updating product', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update product. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loader">
                <div className="cell d-0"></div>
                <div className="cell d-1"></div>
                <div className="cell d-2"></div>
                <div className="cell d-1"></div>
                <div className="cell d-2"></div>
                <div className="cell d-2"></div>
                <div className="cell d-3"></div>
                <div className="cell d-3"></div>
                <div className="cell d-4"></div>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card">
                        <h2 className="mb-4 mt-3 text-center">Update Product</h2>
                        <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="productName" className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        id="productName"
                                        name="productName"
                                        className="form-control"
                                        value={product.productName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="productDescription" className="form-label">Product Description</label>
                                    <textarea
                                        id="productDescription"
                                        name="productDescription"
                                        className="form-control"
                                        value={product.productDescription}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        className="form-control"
                                        value={product.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="discountPrice" className="form-label">Discount %</label>
                                    <input
                                        type="number"
                                        id="discountPrice"
                                        name="discountPrice"
                                        className="form-control"
                                        value={product.discountPrice}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="rating" className="form-label">Rating</label>
                                    <input
                                        type="number"
                                        id="rating"
                                        name="rating"
                                        className="form-control"
                                        value={product.rating}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Image</label>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn submit_button btn-block" disabled={loading}>
                                        <span>{loading ? "Updating..." : "Update Product"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
