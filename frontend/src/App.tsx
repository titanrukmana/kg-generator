import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MultiDirectedGraph } from "graphology";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { GraphEvents } from "./Event";
import TextBox from "./components/TextBox";

interface IGraphContent {
	nodes: {
		id: number;
		name: [string];
		centrality: number;
	}[];

	relationships: {
		id: number;
		type: string;
		start: number;
		end: number;
	}[];
}

function App() {
	const [graphContent, setGraphContent] = useState<IGraphContent>();
	const [data, setData] = useState<string>("");
	const graph = useMemo(() => {
		return new MultiDirectedGraph();
	}, []);

	const handleChange = useCallback((newValue: string) => {
		setData(newValue);
	}, []);

	useEffect(() => {
		const controller = new AbortController();

		const fetchGraphContent = async () => {
			try {
				const resp = await axios.get(import.meta.env.VITE_API_URL + "llms", {
					signal: controller.signal,
				});

				if (!resp.data.nodes) return;
				setGraphContent(resp.data);
			} catch (e) {
				console.log(e);
			}
		};

		fetchGraphContent();

		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (!graphContent || !graphContent.nodes || !graphContent?.relationships) return;
		graphContent?.nodes.forEach((node) => {
			if (!graph.hasNode(node.id.toString())) {
				graph.addNode(node.id.toString(), {
					label: node.name,
					size: node.centrality < 8 ? 6 : node.centrality,
					x: Math.random(),
					y: Math.random(),
					color: "#1F1717",
				});
			} else {
				graph.updateNode(node.id.toString(), (attr) => {
					return {
						...attr,
						size: node.centrality < 8 ? 6 : node.centrality,
					};
				});
			}
		});

		graphContent?.relationships.forEach((relationship) => {
			graph.addDirectedEdge(relationship.start.toString(), relationship.end.toString(), {
				color: "#1F1717",
			});
		});

		return () => {
			graph;
		};
	}, [graph, graphContent]);

	useEffect(() => {
		if (!data) return;

		const controller = new AbortController();

		const updateGraphContent = async () => {
			try {
				const resp = await axios.put(
					import.meta.env.VITE_API_URL + "llms",
					{
						content: data,
					},
					{
						signal: controller.signal,
					}
				);
				setGraphContent(resp.data);
			} catch (e) {
				console.log(e);
			}
		};

		updateGraphContent();
		setData("");
	}, [data]);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				backgroundColor: "#F3F8FF",
			}}
		>
			<TextBox onChange={handleChange} />
			{graphContent && graphContent.nodes && (
				<SigmaContainer
					graph={graph}
					style={{
						height: "100vh",
						width: "50vw",
						backgroundColor: "#F3F8FF",
						marginRight: "5vw",
					}}
					settings={{
						nodeProgramClasses: { image: getNodeProgramImage() },
						defaultNodeType: "image",
						defaultEdgeType: "arrow",
						labelDensity: 0.07,
						labelGridCellSize: 30,
						labelColor: {
							color: "#1F1717",
						},
						labelRenderedSizeThreshold:
							0.7 *
							graphContent.nodes.reduce((acc, val) => {
								return acc > val.centrality ? acc : val.centrality;
							}, 0),
						zIndex: true,
					}}
				>
					<GraphEvents />
				</SigmaContainer>
			)}
		</div>
	);
}

export default App;
