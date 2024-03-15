import pandas as pd
import plotly.graph_objects as go
import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
import schedule
import time

file_path = 'C:/Users/AL-STEIN/Desktop/stage/excel/DBBRISE.xlsx'


def read_excel_file(file_path):
    return pd.read_excel(file_path)

def process_data(df):
    print(f'processing {df}')


# =========================================================================
#read excel file
data = read_excel_file(file_path)
# Set up Dash app
app = dash.Dash(__name__)

# Define layout of the dashboard
app.layout = html.Div(children=[
    html.H1(children='Brise Dashboard'),
    html.Div(id='total-sales'),
    dcc.Graph(
        id='example-graph',
        figure={
            'data': [
                {'x': [1, 2, 3], 'y': [4, 1, 2], 'type': 'bar', 'name': 'SF'},
                {'x': [1, 2, 3], 'y': [2, 4, 5], 'type': 'bar', 'name': u'Montréal'},
            ],
            'layout': {
                'title': 'Dash Data Visualization'
            }
        }
    )
])

# Callback to update dashboard components
@app.callback(
    [Output('total-sales', 'children'),
     Output('sales-by-product', 'figure')],
    [Input('interval-component', 'n_intervals')]
)
def update_dashboard(n):
    # Read Excel file
    df = read_excel_file(file_path)
    # Process data
    total_sales = process_data(df)
    # Example: Create bar chart of sales by product category
    sales_by_product = df.groupby('Product')['Sales'].sum().reset_index()
    fig = go.Figure(data=[go.Bar(x=sales_by_product['Product'], y=sales_by_product['Sales'])])
    # Return updated components
    return f'Total Sales: ${total_sales}', fig

# Schedule data collection and processing every hour
def job():
    df = read_excel_file(file_path)
    process_data(df)

schedule.every().hour.do(job)

# Run Dash app
if __name__ == '__main__':
    app.run_server(debug=True)
    while True:
        schedule.run_pending()
        time.sleep(1)
