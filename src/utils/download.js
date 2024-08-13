import download from "downloadjs";

const getFormatDetails = (format, type, compressed = false) => {
  var mimeType = "text";
  var fields = undefined;
  var data = "text";
  var ext = "";

  if (format === "csv") {
    mimeType = "text/csv";
    ext = ".csv";
  } else if (format === "fasta") {
    mimeType = "text/plain";
    type = "protein_sequence";
    ext = ".fasta";
  } else if (format === "json") {
    mimeType = "application/json";
    ext = ".json";
  } else if (format === "png") {
    data = undefined;
    fields = { responseType: "blob" };
    mimeType = "image/png";
    ext = ".png";
  } else if (format === "tsv") {
    mimeType = "text/tsv";
    ext = ".tsv";
  } else if (format === "byonic") {
    mimeType = "text/plain";
    ext = ".byonic";
  } else if (format === "grits") {
    mimeType = "application/xml";
    ext = ".grits";
  } else if (format === "svg") {
    mimeType = "application/xml";
    ext = ".svg";
  }

  if (compressed) {
    data = undefined;
    fields = { responseType: "blob" };
    mimeType += ", application/gzip";
    ext += ".gzip";
  }

  return {
    mimeType,
    fields,
    ext,
    data,
    type
  };
};

/**
 * This will download the data of the respective page in the user selected format.
 * @author Rupali Mahadik.
 * @param {string} id the ID of the glycan or protein page. (ex.: uniprot_canonical_ac)
 * @param {string} format the file format or mimeType of the data to be received.
 * @param {boolean} compressed "true" to receive compressed data otherwise it is "false".
 * @param {string} type the page whose data needs to be downloaded.
 */
export const downloadFromServer = async (
  id,
  format,
  compressed,
  type,
  itemTypeResolver,
  section,
  customFileName,
  filters
) => {
  const formatDetails = getFormatDetails(format, customFileName ? customFileName : section ? section  : type, compressed);
  const { fields, data } = formatDetails;
  const serverData = await itemTypeResolver(id, format, compressed, type, {
    "Content-Type": data
  }, section, filters);
  const { mimeType, ext, type: newType } = formatDetails;
  const filename = `${newType}_${id}${ext}`;

  download(serverData.data, filename, mimeType);
};

export const downloadFileFromServer = async (
  id,
  url,
  mimeType,
  fileName,
  itemTypeResolver
) => {
  const serverData = await itemTypeResolver(id, url);
  download(serverData.data, fileName, mimeType);
};

export const downloadFile = (
  data,
  fileName,
  mimeType,
) => {

  download(data, fileName, mimeType);
};