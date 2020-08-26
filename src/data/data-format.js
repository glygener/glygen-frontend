export function groupSpeciesEvidences(values) {
	var groupedEvidences = {};

	if (!values) {
		return groupedEvidences;
	}

	for (const s of values) {
		groupedEvidences[s.name] = { taxid: s.taxid, evidence: [] };
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
