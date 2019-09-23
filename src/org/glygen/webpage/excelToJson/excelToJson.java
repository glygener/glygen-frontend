package org.glygen.webpage.excelToJson;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
//import java.util.Iterator;
import java.util.regex.Matcher;

/**
 * This program will access the excel file and generate a json key-value file
 * from the excel sheet data. Column positions are assigned in the getColumnCount(r) method.
 * 
 * @author Gaurav Agarwal
 * @date Oct 8, 2018
 */
public class excelToJson {
    /**
     * the name of the excel file with it's path. Path is relative to the jar file.
     */
    public static final String INPUT_FILE_NAME = "../doc/key-value.xlsx";
    
    /**
     * name of the resulting JSON file with the path. Path is relative to the jar
     * file.
     */
    public static final String RESULT_FILE_NAME = "../Front-End/src/content/key-value.json";
    
    /**
     * When true the output will only be few essential columns, 
     * else all the columns of the excel sheet are output.
     */
    public static final boolean ESSENTIAL_COLUMNS_ONLY = true;
    
    /**
     * Column positions in excel.
     */
    public static int DISPLAY_NAME, 
    				ABREVIATED_TERM, 
    				KEY, 
    				PROPERTY, 
    				TOOL_TIP, 
    				DESCRIPTION, 
    				EXAMPLE, 
    				DATA_TYPE;
    
    /**
     * This calculates the number of columns in the sheet by checking the heading of
     * the columns. If the heading is found to be blank, that means there are no
     * more columns ahead. Also, it assigns appropriate column position index to the headers.
     * 
     * @param r the first row containing the headers.
     * @return the number of columns having data.
     */
    public static int getColumnCount(Row r) {
        int col = 0;
        while (true) {
            if (r.getCell(col) == null || r.getCell(col).getCellType() == CellType.BLANK) {
                break;
            } else if(r.getCell(col).toString().toLowerCase().contains("display")){
            	DISPLAY_NAME = col;
            } else if(r.getCell(col).toString().toLowerCase().contains("abreviate")){
            	ABREVIATED_TERM = col;
            } else if(r.getCell(col).toString().toLowerCase().contains("key")){
            	KEY = col;
            } else if(r.getCell(col).toString().toLowerCase().contains("property")){
            	PROPERTY = col;
            } else if(r.getCell(col).toString().toLowerCase().contains("tool")){
            	TOOL_TIP = col;
            } else if(r.getCell(col).toString().toLowerCase().contains("description")){
            	DESCRIPTION = col;
            } else if(r.getCell(col).toString().toLowerCase().contains("example")){
            	EXAMPLE = col;
            } else if(r.getCell(col).toString().toLowerCase().contains("type")){
            	DATA_TYPE = col;
            }
            col++;
        }
        return col;
    }

    /**
     * Every column of every row is iterated over to get the cell values and are 
     * appended to a String object in a json string format. 
     * The output is eventually written to a json file.
     * 
     * @param args not being used here.
     */
    public static void main(String[] args) {
        try {
            FileInputStream excelFile = new FileInputStream(new File(INPUT_FILE_NAME));
            Workbook workbook = new XSSFWorkbook(excelFile);
            Sheet sheet = workbook.getSheetAt(0);
            // char last_column = 'H';
            // int numOfColumns = (int) last_column - 64;
            int numOfRows = sheet.getLastRowNum();
            int numOfColumns = getColumnCount(sheet.getRow(0));

            ArrayList<Object> rowElements = new ArrayList<>();
            String op = "{";
            for (int currentRow = 1; currentRow < numOfRows; currentRow++) {
                Row r = sheet.getRow(currentRow);
                // Check for empty rows or rows having empty KEY column.
                if (r == null || r.getCell(KEY) == null || r.getCell(KEY).getCellType() == CellType.BLANK) {
                    // This whole row is empty
                    continue;
                }
                // getting the row values into an ArrayList.
                for (int currentColumn = 0; currentColumn < numOfColumns; currentColumn++) {
                    Cell currentCell = r.getCell(currentColumn);
                    if (currentCell == null || currentCell.getCellType() == CellType.BLANK) {
                        rowElements.add("\"\"");
                    } else if (currentCell.getCellType() == CellType.NUMERIC) {
                        rowElements.add(currentCell.getNumericCellValue());
                    } else if (currentCell.getCellType() == CellType.STRING) {
                        String s = currentCell.getStringCellValue();
                        s = s.replaceAll("\"", Matcher.quoteReplacement("\\\""));
                        rowElements.add("\"" + s + "\"");
                    }
                }
                if(ESSENTIAL_COLUMNS_ONLY) {
                	op += rowElements.get(KEY) + ": { \"display_name\": " + rowElements.get(DISPLAY_NAME)
                    + ", \"abreviated_term\": " + rowElements.get(ABREVIATED_TERM) + ", \"tooltip\":" + rowElements.get(TOOL_TIP)
                    + " }";
                } else {
	                op += rowElements.get(KEY) + ": { \"display_name\": " + rowElements.get(DISPLAY_NAME)
	                        + ", \"abreviated_term\": " + rowElements.get(ABREVIATED_TERM) + ", \"property\": "
	                        + rowElements.get(PROPERTY) + ", \"tooltip\":" + rowElements.get(TOOL_TIP)
	                        + ", \"description\": " + rowElements.get(DESCRIPTION) + ", \"example\": "
	                        + rowElements.get(EXAMPLE) + ", \"data_type\": " + rowElements.get(DATA_TYPE) + " }";
                }
                op += ",";
                rowElements.clear();
            }
            op = op.substring(0, op.length() - 1);      //removing the last ","
            op += "}";
            // System.out.print(op);
            JSONObject jsonObj = new JSONObject(op);
            // System.out.print(jsonObj);
            FileWriter jsonFile = new FileWriter(RESULT_FILE_NAME);
            jsonFile.write(jsonObj.toString());
            jsonFile.close();
            workbook.close();
            excelFile.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}