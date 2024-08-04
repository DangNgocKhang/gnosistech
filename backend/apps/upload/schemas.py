
from pydantic import BaseModel
import pandas as pd


class UploadFileSchema(BaseModel):
    filename: str
    content_type: str
    

"""
---------------------------------------
Pydantic model to validate if an object is a pandas DataFrame
---------------------------------------
"""
class DataFrameModel(BaseModel):
    data: pd.DataFrame

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {pd.DataFrame: lambda df: df.to_json(orient="split")}