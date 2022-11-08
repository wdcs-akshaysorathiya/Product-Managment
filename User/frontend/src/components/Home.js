import React, { useContext, useEffect, useMemo, useState } from 'react'
import Template from './Template';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/Globalcontext';
import ReactPaginate from "react-paginate";
import queryString from "query-string";
import Pagination from "react-bootstrap/Pagination";
import { useSearchParams } from 'react-router-dom';


function Home() {

    const navigate = useNavigate();
    const { setCountre } = useContext(GlobalContext);
    const [productdata, setProduct] = useState([]);
    let { search } = useLocation();
    const [categoryParams, setCategoryParams] = useSearchParams();
    let categoryItems = categoryParams.get('categoryItems')
    let { filteredCategory, setPages, searchParam } = queryString.parse(search);
    const [currentparams, setCurrentParams] = useState({ skip: 0, limit: 10 });
    const [pageCount, setPageCount] = useState();
    const [serchparams, setSearchParams] = useState(searchParam ? searchParam : '');
    const [categorydetails, setCategoryDetails] = useState([]);
    const [categoryfilter, setCategoryfilter] = useState(categoryItems ? categoryItems.split(',').map(r => ([{ _id: r, isChecked: true }])) : []);



    const arr = [];

    useEffect(() => {
        (async () => {
            let querystring = `?limit=${currentparams.limit}&skip=${currentparams.skip}`;
            if (serchparams) {
                querystring += `&key=${serchparams}`;
            }
            if (setPages) {
                currentparams.skip = `${setPages - 1}` * currentparams.limit;
            }
            if (arr) {
                let ar = [];
                categoryfilter.map(iteam => ar.push(iteam[0]._id))
                querystring += `&category=${ar}`;
                setCategoryParams({ categoryItems: ar ? [ar] : '', setPages: setPages ? setPages : '', searchParam: serchparams })
            }
            const result = await axios.get(`http://localhost:5000/getallproducts/${querystring}`)
            const total = result.data.procount

            setCategoryDetails(result.data.categorykey.map(r => {
                let find = categoryfilter.find(t => t[0]._id === r._id);
                if (find) {
                    return { ...find[0] }
                } else {
                    return ({ ...r, isChecked: false })
                }
            }))
            setProduct(result.data.data);
            setPageCount(Math.ceil(total / currentparams.limit));
        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentparams, serchparams, categoryfilter, setPages, pageCount, filteredCategory, searchParam])




    const serchHandle = async (event) => {
        setSearchParams(event.target.value);
        navigate(`/home?searchParam=${event.target.value}`);
    }

    const addToCart = (id, name, price, qty) => {
        let data = localStorage.product ? JSON.parse(localStorage.product) : [];
        const filtered = data.findIndex(item => item.id === id);
        if (filtered >= 0) {
            alert('already added')
        } else {
            setCountre(data.length + 1)
            data.push({ id: id, name: name, price: price, qty: qty });
            localStorage.product = JSON.stringify(data);
        }
    }
    console.log('serchparams', serchparams);
    const changePages = async (e) => {
        const selectedPage = e.selected + 1;
        setCurrentParams({ skip: (selectedPage) * currentparams.limit, limit: currentparams.limit, searchParam: searchParam ? searchParam : '' });
        navigate(`/home?setPages=${selectedPage}`);
    }

    const getCatecoryData = (id) => {
        let findIndex = categorydetails.findIndex(r => r._id === id);
        categorydetails[findIndex].isChecked = !categorydetails[findIndex].isChecked;
        setCategoryDetails([...categorydetails]);
        if (categorydetails[findIndex].isChecked) {
            arr.push(categorydetails[findIndex]);
            setCategoryfilter(categoryfilter ? [...categoryfilter, arr] : arr);
        } else {
            const index = categoryfilter.indexOf(id);
            if (index >= -1) {
                categoryfilter.splice(index, 1);
            }
            setCategoryfilter(categoryfilter ? [...categoryfilter] : []);
        }
    }

    return (
        <>
            <div>
                <Template />
                <div className="my-container">
                    <input type="text" className="m-3" placeholder="serch here" defaultValue={searchParam ? searchParam : ''} onChange={serchHandle} />
                    <div className="cat">
                        {
                            categorydetails.map((cat) => {
                                const obj = { checked: cat.isChecked ? 'checked' : '' };
                                return <>
                                    <input id={`category${cat._id}`} {...obj} defaultChecked={cat.isChecked} className="cat" type="checkbox" onChange={() => { getCatecoryData(cat._id) }} />
                                    <label htmlFor="category" onClick={() => { getCatecoryData(cat._id) }}>{cat._id}</label>
                                </>
                            })
                        }
                    </div>
                    <Container>
                        <Row>

                            {
                                productdata && productdata.length > 0 ? productdata.map((post, key) =>

                                    <Col>
                                        <Card key={post._id} className='m-2' style={{ width: '18rem' }}>
                                            <Card.Img variant="top" src={post.image} />
                                            <Card.Body>
                                                <Card.Title>Name : {post.name}</Card.Title>
                                                <Card.Text>Price : {post.price}</Card.Text>
                                                <Card.Text>Category : {post?.category?.name}</Card.Text>
                                                <Card.Text>Company : {post.company}</Card.Text>
                                                <Button variant="primary" onClick={() => addToCart(`${post._id}`, `${post.name}`, `${post.price}`, 1, `${key + 1}`)}>Add to Cart</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ) : <h2>No data</h2>
                            }
                            <Pagination>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    pageCount={pageCount}
                                    onPageChange={changePages}
                                    containerClassName={"paginationBttns"}
                                    previousLinkClassName={"previousBttn"}
                                    nextLinkClassName={"nextBttn"}
                                    disabledClassName={"paginationDisabled"}
                                    activeClassName={"paginationBttnsActive"}
                                    forcePage={setPages ? setPages - 1 : 0}
                                    renderOnZeroPageCount={null}
                                />
                            </Pagination>
                        </Row>
                    </Container>
                </div>
            </div >
        </>
    )
}

export default Home
