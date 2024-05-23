export function groupOrganismEvidences(values) {
	var groupedEvidences = {};

	if (!values) {
		return groupedEvidences;
	}

	for (const s of values) {
		groupedEvidences[s.name] = {
			taxid: s.taxid,
			common_name: s.common_name,
			reference_species: s.reference_species,
			glygen_name: s.glygen_name,
			name: s.name,
			evidence: [],
		};
		for (const e of s.evidence) {
			if (e.database in groupedEvidences[s.name].evidence) {
				groupedEvidences[s.name]["evidence"][e.database].push({
					id: e.id,
					url: e.url,
				});
			} else {
				groupedEvidences[s.name]["evidence"][e.database] = [
					{
						id: e.id,
						url: e.url,
					},
				];
			}
		}
	}
	return groupedEvidences;
}

export function groupOrganismEvidencesTableView(values) {
	var groupedEvidences = [];

	if (!values) {
		return groupedEvidences;
	}

	let order = 0;
	for (const s of values) {

		let grEve = groupedEvidences.find(obj => obj.common_name == s.common_name);

		if (grEve) {
			continue;
		}

		let spArray = values.filter(obj => obj.common_name == s.common_name);
		order++;
		let obj = {
			common_name: s.common_name,
			glygen_name: s.glygen_name,
			evidence: [],
			expanded_table: [],
			species_count: spArray.length,
			annotation_count: 0,
			order: order
		}

		for (const sp of spArray) {
			let expTableRow = [];
			let arr = [];
			obj.taxid = sp.taxid;
			for (const e of sp.evidence) {
				if (e.database in obj.evidence) {
					if (arr[e.database] && !(e.id in arr[e.database])) {
						obj["evidence"][e.database].push({
							id: e.id,
							url: e.url,
						});
						arr[e.database].push(e.id)
					}
				} else {
					obj["evidence"][e.database] = [
						{
							id: e.id,
							url: e.url,
						},
					];
					arr[e.database] = [e.id]
				}

				obj.annotation_count++;
				order++;

				expTableRow.push({
					database: e.database,
					name: sp.name,
					common_name: s.common_name,
					taxid: sp.taxid,
					id: e.id,
					url: e.url,
					order: order
				})
			}
			obj.expanded_table.push(...expTableRow);
		}

		groupedEvidences.push(obj);
	}
	return groupedEvidences;
}

export function groupEvidences(values) {
	var groupedEvidences = {};

	if (!values) {
		return groupedEvidences;
	}

	for (const value of values) {
		if (!groupedEvidences[value.database]) {
			groupedEvidences[value.database] = [];
		}

		groupedEvidences[value.database].push({
			id: value.id,
			url: value.url,
		});
	}

	return groupedEvidences;
}

export function groupPublicationEvidences(values) {
	var groupedEvidences = {};

	if (!values) {
		return groupedEvidences;
	}

	for (const s of values) {
		groupedEvidences[s.pmid] = {};

		for (const e of s.evidence) {
			if (e.database in groupedEvidences[s.pmid]) {
				groupedEvidences[s.pmid][e.database].push({
					id: e.id,
					url: e.url,
				});
			} else {
				groupedEvidences[s.pmid][e.database] = [
					{
						id: e.id,
						url: e.url,
					},
				];
			}
		}
	}
	return groupedEvidences;
}
