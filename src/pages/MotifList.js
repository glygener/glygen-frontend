import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getMotifList } from "../data";
import { MOTIF_LIST_COLUMNS } from "../data/motif";
import PaginatedTable from "../components/PaginatedTable";
import Container from "@material-ui/core/Container";
// import DownloadButton from "../components/DownloadButton";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
import ReactHtmlParser from "react-html-parser";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import { Row } from "react-bootstrap";
import { Grid } from "@material-ui/core";

const MotifList = (props) => {
	let { id } = useParams();

	const [data, setData] = useState([]);
	const [query, setQuery] = useState([]);
	const [pagination, setPagination] = useState([]);
	const [motifListColumns, setMotifListColumns] = useState(MOTIF_LIST_COLUMNS);
	const [page, setPage] = useState(1);
	const [sizePerPage, setSizePerPage] = useState(20);
	const [totalSize, setTotalSize] = useState();
	const [pageLoading, setPageLoading] = useState(true);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{ show: false, id: "" }
	);

	const fixResidueToShortNames = (query) => {
		const residueMap = stringConstants.glycan.common.composition;
		const result = { ...query };

		if (result.composition) {
			result.composition = result.composition
				.sort((a, b) => {
					if (residueMap[a.residue].orderID < residueMap[b.residue].orderID) {
						return -1;
					} else if (
						residueMap[a.residue].orderID < residueMap[b.residue].orderID
					) {
						return 1;
					}
					return 0;
				})
				.map((item) => ({
					...item,
					residue: ReactHtmlParser(residueMap[item.residue].name.bold()),
				}));
		}

		return result;
	};

	useEffect(() => {
		setPageLoading(true);
		logActivity("user", id);

		getMotifList(id)
			.then(({ data }) => {
				if (data.error_code) {
					let message = "list api call";
					logActivity("user", id, "No results. " + message);
					setPageLoading(false);
				} else {
					setData(data.results);
					setQuery(fixResidueToShortNames(data.query));
					setPagination(data.pagination);
					const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
					setPage(currentPage);
					setTotalSize(data.pagination.total_length);
					setPageLoading(false);
				}
			})
			.catch(function (error) {
				let message = "list api call";
				axiosError(error, id, message, setPageLoading, setAlertDialogInput);
			});
	}, []);

	const handleTableChange = (
		type,
		{ page, sizePerPage, sortField, sortOrder }
	) => {
		setPage(page);
		setSizePerPage(sizePerPage);

		getMotifList(
			id,
			(page - 1) * sizePerPage + 1,
			sizePerPage,
			sortField,
			sortOrder
		).then(({ data }) => {
			// place to change values before rendering

			setData(data.results);
			setQuery(fixResidueToShortNames(data.query));
			setPagination(data.pagination);

			//   setSizePerPage()
			setTotalSize(data.pagination.total_length);
		});
	};

	function rowStyleFormat(row, rowIdx) {
		return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
	}

	return (
		<>
			<Helmet>
				{getTitle("motifList")}
				{getMeta("motifList")}
			</Helmet>

			<FeedbackWidget />
			<Container maxWidth="xl" className="gg-container">
				<PageLoader pageLoading={pageLoading} />
				<DialogAlert
					alertInput={alertDialogInput}
					setOpen={(input) => {
						setAlertDialogInput({ show: input });
					}}
				/>

				<section>
					<div className="content-box-md">
						<Row>
							<Grid item xs={12} sm={12} className="text-center">
								<div className="horizontal-heading">
									<h5>Look At</h5>
									<h2>
										List of <strong>Motifs</strong>
									</h2>
								</div>
							</Grid>
						</Row>
					</div>
					{/* <DownloadButton
						types={[
							{
								display: stringConstants.download.motif_csvdata.displayname,
								type: "csv",
								data: "motif_list",
							},
							{
								display: stringConstants.download.motif_jsondata.displayname,
								type: "json",
								data: "motif_list",
							},
						]}
						dataId={id}
					/> */}
					{motifListColumns && motifListColumns.length !== 0 && (
						<PaginatedTable
							trStyle={rowStyleFormat}
							data={data}
							columns={motifListColumns}
							page={page}
							sizePerPage={sizePerPage}
							totalSize={totalSize}
							onTableChange={handleTableChange}
							defaultSortField="glycan_count"
							defaultSortOrder="desc"
						/>
					)}
				</section>
			</Container>
		</>
	);
};

export default MotifList;
