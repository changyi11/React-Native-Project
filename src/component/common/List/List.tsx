import React, { Component } from 'react'
import { View, Text, Image, FlatList } from 'react-native'
import styles from './styles'

interface Props {
}
interface State {
    items: Array<any>,
    refreshing: boolean
}
class List extends Component<Props,State> {
    constructor(props: any) {
        super(props)
        this.state = {
            items:[],
            refreshing: false
        }
        this.page = 1
    }
    page: number
    getItem (isAdd: any) {
        fetch(`https://wap.shixiseng.com/interns/search?p=${this.page}&k=&i=&c=&s=-&x=&d=&m=`)
            .then( response => response.json() )
            .then( result => {
                this.page ++
                if (isAdd) {
                    this.setState({
                        items: this.state.items.concat(result.msg),
                        refreshing: false
                    })
                } else {
                    this.setState({
                        items: result.msg,
                        refreshing: false
                    })
                }
            })
    }
    componentDidMount() {
        this.getItem(true)
    }
    // list里面的renderItem会给他传递一个对象，里面有item和index，item就是每一条数据
    // this.state.items.map((item,index) => )
    // map方法是数组的方法，他第一个参数是数组内的每一个数值，第二个参数才是index
    renderItem(prop: any) {
        let { item } = prop
        return(
            <View style = {styles.ListItem}>
                <View style = {styles.ListLeft}>
                    <Image style = {styles.ListImg} source = {{ uri: item.logo_url}} />
                </View>
                <View style = {styles.ListRight}>
                    <View style = {styles.ListRightTop}>
                        <Text 
                            ellipsizeMode = 'tail'
                            numberOfLines = { 1 }  
                            style = {styles.ListRightTopOne}
                        >{item.name}</Text>
                        <Text style = {styles.ListRightTopTwo}>{item.effective_time.substring(5)}</Text>
                    </View>
                    <Text style = {styles.ListRightCenter}>{item.company_name}</Text>
                    <View style = {styles.ListRightBottom}>
                        <Text style = {styles.ListRightBottomBlc}>{item.city}</Text>
                        <Text style = {styles.ListRightBottomBlc}>{item.month_num}个月</Text>
                        <Text style = {styles.ListRightBottomRed}>￥{item.minsalary}-{item.maxsalary}/天</Text>
                    </View>
                </View>   
            </View>
        )
    }
    _onEndReached = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.getItem(true)
        })
    }
    _onRefresh = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.getItem(false)
        })
    }
    _keyExtractor = (item:any) => item.uuid;
    render () {
        return(
            <View style = {styles.Wrapper}>
                {/* 这里有因为有个padding和margin而滚动部分是flatlist，所以一出现就有两个白条 */}
                <FlatList
                //  将数据放在这里
                    data = {this.state.items}
                //  渲染数据的方法
                    renderItem = {this.renderItem}
                //  距离下方多少距离开始刷新
                    onEndReachedThreshold = {0.1}
                //  上拉刷新的方法
                    onEndReached = {this._onEndReached}
                //  这是下拉刷新的方法
                    onRefresh = {this._onRefresh}
                //  刷新loding图
                    refreshing = {this.state.refreshing}
                //  这里是一个函数，第一个参数是item，第二个是index，item就是每一条数据，被抽离出来
                    keyExtractor = {this._keyExtractor}
                //  优化
                    /* getItemLayout = */
                >
                </FlatList>
            </View>
        )
    }
} 

export default List