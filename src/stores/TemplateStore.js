import { observable, action, runInAction } from 'mobx';
import ApiService from '../services/ApiService';
import Constant from '../config/Constant';

class TemplateStore {
  @observable treeData = [];

  @observable expandedKeys = [];

  @observable selectedTreeInfo = {
    title: '전체',
    key: '0',
    level: 0
  };

  @observable
  currentTabName = Constant.TEMPLATE_SEARCH_TAB_ALL;

  @observable
  checkMyAdd = false;

  @observable
  searchType = '';

  @observable
  searchValue = '';

  @observable
  page = 1;

  @observable
  pageSize = 10;

  @observable
  templateList = [];

  @observable
  totalCount = 0;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  getTreeData() {
    ApiService.get('category/tree').then(response => {
      let data = response.data;
      let rootTreeInfo = {
        title: '전체',
        key: '0',
        children: data,
        level: 0
      };
      runInAction(() => {
        this.treeData = [rootTreeInfo];
        this.expandedKeys = ['0'];
        this.selectedTreeInfo = rootTreeInfo;
      });
    });
  }

  @action
  selectTree(treeInfo) {
    this.selectedTreeInfo = treeInfo;
    this.changePage(1);
  }

  @action
  expendTree(expandedKeys) {
    this.expandedKeys = expandedKeys;
  }

  @action
  changeSearchType(searchType) {
    this.searchType = searchType;
  }

  @action
  changeSearchValue(searchValue) {
    this.searchValue = searchValue;
  }

  @action
  changeCurrentTabName(tabName) {
    this.currentTabName = tabName;
    this.changePage(1);
  }

  @action
  changeCheckMyAdd(checkMyAdd) {
    this.checkMyAdd = checkMyAdd;
    this.changePage(1);
  }

  @action
  changePage(page) {
    this.page = page;
    this.search();
  }

  @action
  changeFavortie(templateId, isFavortie) {
    ApiService.put('template/' + templateId + '/favorite', {
      value: isFavortie ? false : true
    }).then(() => {
      this.search();
    });
  }

  @action
  deleteTemplate(templateId) {
    ApiService.delete('template/' + templateId).then(() => {
      this.search();
    });
  }

  @action
  search() {
    let apiParam = {
      checkMyAdd: this.checkMyAdd ? 1 : 0,
      searchType: this.searchType,
      searchValue: this.searchValue,
      page: this.page,
      pageSize: this.pageSize,
      checkFavorite:
        this.currentTabName === Constant.TEMPLATE_SEARCH_TAB_FAVORITE ? 1 : 0
    };
    let treeInfo = this.selectedTreeInfo;
    if (treeInfo) {
      if (treeInfo.level === 1) {
        apiParam.categoryLargeId = treeInfo.id;
      } else if (treeInfo.level === 2) {
        apiParam.categoryMiddleId = treeInfo.id;
      } else if (treeInfo.level === 3) {
        apiParam.categorySmallId = treeInfo.id;
      }
    }
    ApiService.get('template', { params: apiParam }).then(({ data }) => {
      runInAction(() => {
        this.templateList = data.data;
        this.totalCount = data.totalCount;
      });
    });
  }

  @action
  clear() {}
}

export default TemplateStore;
